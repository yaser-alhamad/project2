// models/Activity.js

import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['New Doctor', 'Appointment', 'System', 'Revenue', 'Patient']
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
  
});

const Activity = mongoose.models.activity || mongoose.model('activity', activitySchema);
export { Activity };