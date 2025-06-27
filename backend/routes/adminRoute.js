import express from 'express';
import { loginAdmin, appointmentsAdmin,
         allPatientsRecord, 
         getRecentActivities,
        logActivity,
        appointmentCancel, 
        addDoctor, 
        allDoctors, 
        adminDashboard, 
        getPatientRecord, 
        editPatientRecord, 
        getSlots,
        generateSlots,  
        changeSlotAvailability
    } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.get("/all-patients-record", authAdmin, allPatientsRecord)
adminRouter.get("/patient-record/:id", authAdmin, getPatientRecord)
adminRouter.put("/edit-patient-record/:id", authAdmin, editPatientRecord)
adminRouter.get("/recent-activities", authAdmin, getRecentActivities)
adminRouter.post("/log-activity", authAdmin, logActivity)
adminRouter.get("/get-slots/:doctorId", authAdmin, getSlots)
adminRouter.post("/generate-slots", authAdmin, generateSlots)
adminRouter.post("/change-slot-availability", authAdmin, changeSlotAvailability)
export default adminRouter;