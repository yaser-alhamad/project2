import express from 'express';
import { loginAdmin, appointmentsAdmin, allPatientsRecord, appointmentCancel, addDoctor, allDoctors, adminDashboard, getPatientRecord } from '../controllers/adminController.js';
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

export default adminRouter;