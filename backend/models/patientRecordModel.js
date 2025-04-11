import mongoose from "mongoose";

// Define the patient schema
const patientSchema = new mongoose.Schema(
  {
    // Unique patient identifier
   // patient_id: { type: String, required: true, unique: true },
    docId: { type: String, required: true },
    userId: { type: String, required: true },
    // Patient's full name
    name: { type: String, required: true },
    
    // Date of birth and gender
    date_of_birth: { type: Date, required: true },
    gender: { type: String, required: true },

    // Contact information including phone and address
    contact: {
      phone: { type: String, required: true },
      address: { type: Object, default: { line1: '', line2: '' } },
    },

    // List of previous medical conditions
    medical_history: { type: [String], default: [] },

    // Medications with dosage and frequency
    medications: {
      type: [
        {
          name: String,
          dosage: String,
          frequency: String,
        },
      ],
      default: [],
    },

    // Allergies (e.g., to medications or foods)
    allergies: { type: [String], default: [] },

    // Immunization records (vaccines received, etc.)
    immunizations: {
      type: [
        {
          vaccine: String,
          type: String,
          doses: Number,
          last_booster: String, // Optional for vaccines like tetanus
        },
      ],
      default: [],
    },

    // Medical visits with vital signs and notes
    visits: {
      type: [
        {
          date: Date, // Date of the visit
          reason: String, // Reason for visit
          vital_signs: {
            blood_pressure: String,
            heart_rate: Number,
            weight_lbs: Number,
            blood_glucose_mg_dl: Number,
          },
          physician_notes: String,
          next_appointment: Date,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    minimize: false,  // Allows storing empty objects (if needed)
  }
);

// Reuse model if it already exists to avoid overwrite errors in hot reload environments
const patientModel =
  mongoose.models.patientRecord || mongoose.model("patientRecord", patientSchema);

// Export the patient model
export default patientModel;
