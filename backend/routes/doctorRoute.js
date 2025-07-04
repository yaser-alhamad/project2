import express from 'express';
import { loginDoctor,
     newAppointments,
      appointmentsDoctor, 
      appointmentCancel,
       addPatientRecord,
        getPatientRecord,
         doctorList,
          changeAvailablity,
           appointmentComplete,
            doctorDashboard,
             doctorProfile, 
             updateDoctorProfile,
              doctorPatientsRecord,
              getActiveSlots,
              changeSlotAvailability,
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.post("/add-patient-record", authDoctor, addPatientRecord)
doctorRouter.get("/patients-record/", authDoctor, doctorPatientsRecord)
doctorRouter.get("/patient-record/:id", authDoctor, getPatientRecord)
doctorRouter.get("/new-appointments", authDoctor, newAppointments)
doctorRouter.get("/get-slots/", authDoctor, getActiveSlots)
doctorRouter.post("/change-slot-availability", authDoctor, changeSlotAvailability)




export default doctorRouter;