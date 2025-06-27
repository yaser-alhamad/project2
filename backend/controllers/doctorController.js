import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import patientRecordModel from "../models/patientRecordModel.js";
import { logActivity } from "../utils/activityLogger.js";
import userModel from "../models/userModel.js";

import SoltsTable from "../models/soltsTableModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
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
//API to add patient record
const addPatientRecord = async (req, res) => {
    try {
        const {docId } = req.body;
      
      // const { docId, userId, name, date_of_birth, gender, contact, medical_history, medications, allergies, immunizations, visits } = req.body;
      
        const { userId, name, date_of_birth, gender, contact, medical_history, medications, allergies, immunizations, visits } = {
       
        userId: "67890",
        name: "John Doe",
        date_of_birth: "1990-01-01",
        gender: "Male",
        contact: {
            phone: "123-456-7890",
            address: {
                line1: "123 Main St",
                line2: "Apt 4B"
            }
        },
        medical_history: ["Hypertension", "Diabetes"],
        medications: [
            {
                name: "Metformin",
                dosage: "500mg",
                frequency: "Twice a day"
            },
            {
                name: "Aspirin",
                dosage: "100mg",
                frequency: "Once a day"
            }
        ],
        allergies: ["Penicillin"],
       immunizations: [
        {
            vaccine: "COVID-19 mRNA",
            doses: 2,
            date: "2022-01-01"
        },
       {
        vaccine: "Influenza ",
        doses: 1,
        date: "2022-01-01"
       }
       ],
        visits: [
            {
                date: "2023-01-15",
                reason: "Routine check-up",
                doctor_name: "John Doe",
                doctor_id: docId,
                vital_signs: {
                    blood_pressure: "120/80",
                    heart_rate: 72,
                    weight_lbs: 180,
                    blood_glucose_mg_dl: 90
                },
                physician_notes: "Patient is stable.",
                next_appointment: "2023-07-15"
            },
            {
                date: "2023-06-10",
                reason: "Follow-up visit",
                doctor_name: "John Doe",
                doctor_id: docId,
                vital_signs: {
                    blood_pressure: "118/76",
                    heart_rate: 70,
                    weight_lbs: 178,
                    blood_glucose_mg_dl: 85
                },
                physician_notes: "Patient shows improvement.",
                next_appointment: "2023-12-10"
            }
        ]
       
        }

        
        // Validate required fields
        if (!docId || !userId || !name || !date_of_birth || !gender || !contact) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Create a new patient record
        const patientRecordData = {
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
        
        };
        const newPatientRecord = new patientRecordModel(patientRecordData);
        
        await newPatientRecord.save();
       
        res.json({ success: true, message: 'Patient record added successfully' });
    } catch (error) {
        console.error("Error in addPatientRecord:", error);
        res.json({ success: false, message: error.message });
    }
}
// API to get doctor appointments for doctor panel

// API to get new appointments for doctor panel
const newAppointments = async (req, res) => {
    try {
        const { docId } = req.body
        const appointmentsData = await appointmentModel.find({ docId ,isCompleted:false,cancelled:false})
       
         const newAppointments = await Promise.all(appointmentsData.map(async     (appointment) => {
            const isRecord =  await patientRecordModel.findOne({ userId: appointment.userId })
            return {
             userData:{
                name:appointment.userData.name,
                id:appointment.userId,
                dob:appointment.userData.dob,
                gender:appointment.userData.gender,
                image:appointment.userData.image,
             },
             amount:appointment.amount,
             isCompleted:appointment.isCompleted,
             slotDate:appointment.slotDate,
             slotTime:appointment.slotTime,
             id:appointment._id,
                isRecord:!! isRecord,
                recordId:isRecord ? isRecord._id.toString() : null

             
                }}));
                
             
         res.json({ success: true, newAppointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }  
    }
// API to get doctor patients record for doctor panel
const doctorPatientsRecord = async (req, res) => {
    try {
        const { docId } = req.body
        
        const patients = await patientRecordModel.find({ docId ,'visits.doctor_id': docId })
        
        const patientsData = await Promise.all(patients.map(async (patient) => {
            return {
                id: patient.id,
                name: patient.name,
                docId: patient.docId,
                date_of_birth: patient.date_of_birth,
                gender: patient.gender,
                visits: patient.visits.length,
                last_visit:patient.visits[patient.visits.length - 1].date,
            };
        }));
  
        res.json({ success: true, patientsData });
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }
        res.json({ success: false, message: 'Appointment Not Found' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            
            // Get doctor and patient names
            const doctor = await doctorModel.findById(appointmentData.docId);
            const patient = await userModel.findById(appointmentData.userId);
            
            // Log activity
            await logActivity('Appointment', 
                `Dr. ${doctor.name} completed appointment with ${patient.name}`
            );
            
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, speciality, about, fees } = req.body;
        
        // Update doctor in database
        const doctor = await doctorModel.findByIdAndUpdate(id, 
            { name, speciality, about, fees }, 
            { new: true }
        );
        
        if (doctor) {
            // Log activity using helper function
            await logActivity('Doctor', `Dr. ${doctor.name} updated their profile`);
            
            res.json({ success: true, message: 'Profile updated' });
        } else {
            res.json({ success: false, message: 'Doctor not found' });
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const appointmentsDoctor = async (req, res) => {
    try {  
        const { docId } = req.body
        const appointmentsData = await appointmentModel.find({ docId })
        // Attempt to find a single patient record where the userId matches any from the appointments list
        const match = await patientRecordModel.findOne({ 
            userId: { $in: appointmentsData.map(a => a.userId) } 
          });
        
          const isRecord = !!match; // true if found, false if not
         const appointments = appointmentsData.map(appointment => ({
             userData:{
                name:appointment.userData.name,
                id:appointment.userId,
                dob:appointment.userData.dob,
                gender:appointment.userData.gender,
                image:appointment.userData.image,
             },
             amount:appointment.amount,
             isCompleted:appointment.isCompleted,
             payment:appointment.payment,
             slotDate:appointment.slotDate,
             slotTime:appointment.slotTime,
             isRecord: isRecord
         }));
        
         res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        
        const appointmentsData = await appointmentModel.find({ docId })
        const doctorName = await doctorModel.findById(docId).select('name')
        
        // Attempt to find a single patient record where the userId matches any from the appointments list
        let earnings = 0
        appointmentsData.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        let patients = []
        appointmentsData.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
      
        const Data = {
            earnings,
            name:doctorName.name,
            appointment: appointmentsData.map((item) => ({
                userData:{
                    name:item.userData.name,
                    id:item.userId,
                    dob:item.userData.dob,
                    gender:item.userData.gender,
                    image:item.userData.image,
                 },
                 amount:item.amount,
                 isCompleted:item.isCompleted,
                 cancelled:item.cancelled,
                 payment:item.payment,
                 slotDate:item.slotDate,
                 slotTime:item.slotTime,
            })),
            patients: patients.length, 
        }
       
        res.json({ success: true, Data })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

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

const getActiveSlots = async (req, res) => {
    try {
        const { docId } = req.body
        const slotsData = await SoltsTable.find({ doctorId: docId })
        res.json({ success: true, slotsData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    addPatientRecord,
    doctorPatientsRecord,
    getPatientRecord,
    newAppointments,
    changeSlotAvailability,
    getActiveSlots,
   
}