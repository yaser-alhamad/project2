// utils/activityLogger.js
import { Activity } from "../models/activity.js";

// Helper function to log activities
export const logActivity = async (type, message) => {
  try {
    const newActivity = new Activity({
      type,
      message
    });
    
    await newActivity.save();
    return true;
  } catch (error) {
    console.error('Error logging activity:', error);
    return false;
  }
};

// Helper function to format time (used when retrieving activities)
export const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
};