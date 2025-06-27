import mongoose from "mongoose";

const soltsTableModel = new mongoose.Schema({
    doctorId: { type: String, required: true },
    date: { type: Date, required: true },
    isArchived: { type: Boolean, default: false },
    slots: { 
        type: [
            {
                slotId: { type: String, required: true },
                slotTime: { type: String, required: true },
                isBooked: { type: Boolean, required: true },
                isAvailable: { type: Boolean, required: true },
            }
        ],
        required: true,
     },
});

const SoltsTable = mongoose.model("SoltsTable", soltsTableModel);

export default SoltsTable;
