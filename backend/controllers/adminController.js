import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import patientRecordModel from "../models/patientRecordModel.js";
import { logActivity, formatTimeAgo } from "../utils/activityLogger.js";
import { Activity } from "../models/activity.js";
import SoltsDate from "../models/soltsDateModel.js";
import SoltsTable from "../models/soltsTableModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        // For each appointment, fetch doctor, patient record, and user info
        const detailedAppointments = await Promise.all(appointments.map(async (appointment) => {
            // Get doctor info
            const doctorInfo = await doctorModel.findById(appointment.docId).select('name email speciality degree experience image');
            // Get user info (the user who booked the appointment)
            const userInfoRaw = await userModel.findById(appointment.userId).select('name email phone address dob patients');
            // Only include specific fields in userInfo
            let userInfo = null;
            if (userInfoRaw) {
                userInfo = {
                    _id: userInfoRaw._id,
                    name: userInfoRaw.name,
                    phone: userInfoRaw.phone,
                    address: userInfoRaw.address,
                    dob: userInfoRaw.dob,
                    email: userInfoRaw.email
                };
            }
            // Find patientInfo using patient in userInfoRaw.patients
            let patientInfo = null;
            if (userInfoRaw && userInfoRaw.patients && userInfoRaw.patients.length > 0 && appointment.patientId) {
                patientInfo = userInfoRaw.patients.find(
                    (p) => p._id && p._id.toString() === appointment.patientId.toString()
                );
            }
            return {
                ...appointment.toObject(),
                doctorInfo,
                patientInfo,
                userInfo
            };
        }));
        
        res.json({ success: true, appointments: detailedAppointments });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API to get all patients list
const allPatientsRecord = async (req, res) => {
    try {
        const patients = await patientRecordModel.find({}).select('id name docId date_of_birth gender visits');
       
        const patientsData = await Promise.all(patients.map(async (patient) => {
            const doctorInfo = await doctorModel.findById(patient.docId).select('name speciality');
            return {
                id: patient.id,
                name: patient.name,
                docId: patient.docId,
                date_of_birth: patient.date_of_birth,
                gender: patient.gender,
                visits: patient.visits.length,
                doctorInfo: {
                    name: doctorInfo ? doctorInfo.name : null,
                    speciality: doctorInfo ? doctorInfo.speciality : null,
                }
            };
        }));
        
        res.json({ success: true, patientsData });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to get patient record
const getPatientRecord = async (req, res) => {
    try {
        const { id } = req.params
        const patientRecord = await patientRecordModel.findById(id)
        res.json({ success: true, patientRecord })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//API to edit patient record
const editPatientRecord = async (req, res) => {
    try {
               const {id, docId, userId, name, date_of_birth, gender, contact, medical_history, medications, allergies, immunizations, visits } = req.body;
                const patientData = {
                    docId,
                    userId,
                    name,
                    date_of_birth: Date.parse(date_of_birth),
                    gender,
                    contact,
                    medical_history: Array.isArray(medical_history) ? medical_history : [],
                    medications: Array.isArray(medications) ? medications : [],
                    allergies: Array.isArray(allergies) ? allergies : [],
                    immunizations: Array.isArray(immunizations) ? immunizations : [],
                    visits: Array.isArray(visits) ? visits.map(visit => ({
                        ...visit,
                        date: new Date(visit.date),
                        next_appointment: visit.next_appointment ? new Date(visit.next_appointment) : null
                    })) : [],
                }
               const patientRecord = await patientRecordModel.findByIdAndUpdate(id, patientData, { new: true })
               if(patientRecord){
                res.json({ success: true, message: 'Patient record updated successfully' })
               }else{
                res.json({ success: false, message: 'Patient record not found' })
               }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        
        // Get the doctor and patient names for the message
        const doctor = await doctorModel.findById(appointment.docId);
        const patient = await userModel.findById(appointment.userId);
        
        // Log the activity using helper function
        await logActivity('Appointment', 
            `Appointment cancelled for patient ${patient.name} with Dr. ${doctor.name}`
        );

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        
        // Log activity using helper function
        await logActivity('New Doctor', `Dr. ${name} joined the platform`)

        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        await updateDoctorPerformanceData()
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        
        // Calculate total revenue from appointments
        const totalRevenue = appointments
            .filter(appointment => !appointment.cancelled)
            .reduce((sum, appointment) => sum + appointment.amount, 0)

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            revenue: totalRevenue,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get recent activities
const getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ timestamp: -1 })
            .limit(10);
        
        // Format time for each activity using the helper
        const formattedActivities = activities.map(activity => {
            return {
                type: activity.type,
                message: activity.message,
                time: formatTimeAgo(activity.timestamp)
            };
        });
       
        res.status(200).json({
            success: true,
            activities: formattedActivities
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching activities'
        });
    }
};

// Update doctor performance data (runs once per hour)
const updateDoctorPerformanceData = async () => {
    try {
        // Fetch all appointments
        const appointments = await appointmentModel.find({});
        
        // Get all doctors
        const doctors = await doctorModel.find({});
        
        // Process each doctor
        for (const doctor of doctors) {
            const doctorId = doctor._id.toString();
            
            // Get all appointments for this doctor
            const allDoctorAppointments = appointments.filter(app => 
                app.docId && app.docId.toString() === doctorId
            );
            
            // Get active (non-cancelled) appointments
            const activeAppointments = allDoctorAppointments.filter(app => !app.cancelled);
            
            // Get completed appointments
            const completedAppointments = allDoctorAppointments.filter(app => app.isCompleted);
            
            // Calculate total revenue
            const totalRevenue = activeAppointments.reduce((sum, app) => 
                sum + (Number(app.amount) || 0), 0);
            
            // Calculate completion percentage
            const completionPercentage = allDoctorAppointments.length > 0 
                ? Math.round((completedAppointments.length / allDoctorAppointments.length) * 100) 
                : 0;
            
            // Count unique patients
            const uniquePatientIds = new Set();
            allDoctorAppointments.forEach(app => {
                if (app.userId) {
                    uniquePatientIds.add(app.userId.toString());
                }
            });
            
            // Update performance data in doctor document
            await doctorModel.findByIdAndUpdate(doctorId, {
                PerformanceData: {
                    total_appointments: activeAppointments.length,
                    total_revenue: totalRevenue,
                    total_reviews: doctor.PerformanceData?.total_reviews || 0,
                    total_rating: doctor.PerformanceData?.total_rating || 0,
                    completion_rate: completionPercentage,
                    patient_count: uniquePatientIds.size,
                    updated_at: new Date()
                }
            });
        }
        
        return true;
    } catch (error) {
        console.log("Error updating doctor performance data:", error);
        return false;
    }
};




// Update in adminController.js
const getSystemStatus = async (req, res) => {
  try {
    // // Get real EMR system status from the EMR controller
    // const emrStatusResponse = await axios.get(`${process.env.BASE_URL}/api/emr/system-status`, 
    //   { headers: { aToken: req.headers.aToken } }
    // );
    
    const emrStatus = emrStatusResponse.data.success ? 
      (emrStatusResponse.data.status.online ? "online" : "offline") : 
      "error";
    
    // Rest of your existing code...
    
    // Return all system statuses
    res.json({
      success: true,
      systemStatus: {
        emrSystem: emrStatus,
        patientDatabase: dbStatus,
        apiLatency: apiLatency
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to generate slots for a doctor
const generateSlots = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const doctor = await doctorModel.findById(doctorId);
        
        if(!doctor){
            return res.json({ success: false, message: 'Doctor not found' });
        }

        // Check if doctor already has any slots
        const existingSlotsCount = await SoltsTable.countDocuments({ 
            doctorId, 
            isArchived: false 
        });
        
        if (existingSlotsCount > 0) {
            return res.json({ 
                success: false, 
                message: 'Doctor already has slots.' 
            });
        }

        const slotTimes = [
            "09:00 AM",
            "10:00 AM",
            "11:00 AM",
            "12:00 PM",
            "01:00 PM",
            "02:00 PM",
            "03:00 PM",
            "04:00 PM",
            "05:00 PM",
        ];

        let generatedDates = [];
        let skippedDates = [];

        // Generate slots for the next 30 days except Fridays
        for (let i = 1; i <= 30; i++) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + i);
            const formattedDate = targetDate.toISOString().split('T')[0];

            // Skip Fridays (day 5)
            if (targetDate.getDay() === 5) {
                skippedDates.push(formattedDate);
                continue;
            }

            // Create new slots for this date
            const newSlots = new SoltsTable({
                doctorId,
                date: formattedDate,
                slots: slotTimes.map((time, index) => ({
                    slotId: `${formattedDate}-${index+1}`,
                    slotTime: time,
                    isBooked: false,
                    isAvailable: true
                }))
            });

            await newSlots.save();
            generatedDates.push(formattedDate);
        }

        const response = {
            success: true,
            message: `Generated ${generatedDates.length} days of slots for doctor`,
            generatedDates,
            totalGenerated: generatedDates.length
        };

        if (skippedDates.length > 0) {
            response.skippedFridays = skippedDates.length;
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
//api to get all slots
const getSlots = async (req, res) => {
    try {
        const {doctorId} = req.params
        // Modified to only get non-archived slots
        const query = { isArchived: false }
        
        // If doctorId is provided, filter by doctor
        if (doctorId) {
            query.doctorId = doctorId
        }
        
        const slots = await SoltsTable.find(query)
        const slotsData = await Promise.all(slots.map(async (slot) => {
            const doctorInfo = await doctorModel.findById(slot.doctorId).select('name speciality')
            return {
                id: slot._id,
                date: slot.date,
                slots: slot.slots,
                doctorInfo: doctorInfo
            }
        }))
        res.json({ 
            success: true, 
            slotsData,
            totalActive: slotsData.length
        })
       
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to change slot availability
const changeSlotAvailability = async (req, res) => {
    try {
        const { slotId, slotDayId } = req.body;
      
        const slotDay = await SoltsTable.findById(slotDayId)
        
        const slot = slotDay.slots.find(slot => slot._id.toString() === slotId)
        slot.isAvailable = !slot.isAvailable
        await slotDay.save()
        if(!slot){
            return res.json({ success: false, message: 'Slot not found' });
        }

        res.json({ success: true, message: 'Slot availability updated' });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}
// Export all controllers
export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    allPatientsRecord,
    getPatientRecord,
    editPatientRecord,
    getRecentActivities,
    logActivity,
    updateDoctorPerformanceData,
    getSystemStatus,
    generateSlots,
    getSlots,
    changeSlotAvailability
} 
