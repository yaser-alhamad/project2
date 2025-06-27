import doctorModel from "../models/doctorModel.js";
import SoltsTable from "../models/soltsTableModel.js";
import { logActivity } from "./activityLogger.js";

// Utility to manage slot days: add next day slots, then delete past days
export const manageSlotDays = async () => {
    try {
        // --- Add slots for the next day for all doctors who already have slots ---
        const doctors = await doctorModel.find({});
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        let addedCount = 0;

        for (const doctor of doctors) {
            // Only add slots if the doctor has at least one slot in the system
            const hasAnySlots = await SoltsTable.exists({ doctorId: doctor._id });
            if (!hasAnySlots) continue;

            // Check if slots already exist for this doctor and date
            const existingSlots = await SoltsTable.findOne({
                doctorId: doctor._id,
                date: formattedDate
            });

            // Skip if slots already exist or if it's Friday
            if (existingSlots || tomorrow.getDay() === 5) continue;

            const slotTimes = [
                "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
            ];

            const newSlots = new SoltsTable({
                doctorId: doctor._id,
                date: formattedDate,
                slots: slotTimes.map((time, index) => ({
                    slotId: `${formattedDate}-${index+1}`,
                    slotTime: time,
                    isBooked: false,
                    isAvailable: true
                }))
            });

            await newSlots.save();
            addedCount++;
        }
        console.log(`Slots for ${formattedDate} generated for ${addedCount} doctors with existing slots.`);
        await logActivity(
            'Slot Management',
            `Generated slots for ${addedCount} doctors for ${formattedDate}.`
        );

        // --- Delete all slot days that have passed ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
        const todayStr = today.toISOString().split('T')[0];
        const result = await SoltsTable.deleteMany({ date: { $lt: todayStr } });
        console.log(`Deleted ${result.deletedCount} past slot days.`);
        await logActivity(
            'Slot Management',
            `Deleted ${result.deletedCount} past slot days before ${todayStr}.`
        );
    } catch (error) {
        console.error("Error managing slot days:", error);
        await logActivity('Slot Management', `Error managing slot days: ${error.message}`);
    }
};

