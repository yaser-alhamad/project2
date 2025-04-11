import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import patientRecordModel from "../models/patientRecordModel.js";
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
//API to add patient record
const addPatientRecord = async (req, res) => {
    try {
        const {docId } = req.body;
        console.log(docId);
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
            }
        ],
        allergies: ["Penicillin"],
        immunizations: ["COVID-19 mRNA (2 doses, last booster: 2022-01-01)"],
        visits: [
            {
                date: "2023-01-15",
                reason: "Routine check-up",
                vital_signs: {
                    blood_pressure: "120/80",
                    heart_rate: 72,
                    weight_lbs: 180,
                    blood_glucose_mg_dl: 90
                },
                physician_notes: "Patient is stable.",
                next_appointment: "2023-07-15"
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
            date_of_birth: new Date(date_of_birth),
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
            })) : []
        };
        
        
        const newPatientRecord = new patientRecordModel(patientRecordData);
        
        await newPatientRecord.save();
        console.log("Patient record added successfully");
        res.json({ success: true, message: 'Patient record added successfully' });
    } catch (error) {
        console.error("Error in addPatientRecord:", error);
        res.json({ success: false, message: error.message });
    }
}
// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

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

        res.json({ success: false, message: 'Appointment Cancelled' })

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

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
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
    addPatientRecord
}