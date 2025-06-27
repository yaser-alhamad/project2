import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    PerformanceData:{
      type:Object,
      default:{
        total_appointments:0,
        total_revenue:0,
        
      }
    },
  
  },
  { minimize: false }
);
// the minimize:false is for enabeling storing empty objects like in the slots_booked field
const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema); // this logic is to make sure we dont create multiple models if we already have it created with the same name
export default doctorModel;
