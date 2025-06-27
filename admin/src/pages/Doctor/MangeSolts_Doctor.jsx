import {useContext, useState, useEffect} from 'react'
import {DoctorContext} from '../../context/DoctorContext'
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

const MangeSolts_Doctor = () => {
    const { dToken, changeSlotAvailability ,fetchActiveSlots,setAllSlots,allSlots} = useContext(DoctorContext)
    
    const [loading, setLoading] = useState(false)
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric' 
        })
    } 


    const formatTime = (timeString) => {
        try {
            if (timeString.includes('AM') || timeString.includes('PM')) {
                return timeString;
            }
            
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch {
            return timeString;
        }
    }

    const handelchangeSlotAvailability = (slotId, slotDayId) => {
       
        const slotDay = allSlots.find(slot => slot._id === slotDayId)
        if (!slotDay){
            toast.error("Slot not found")
            return;
        }
        const slot = slotDay.slots.find(s => s._id === slotId)
        if (!slot || slot.isBooked) {
            return;
        }
            const updatedAllSlots = allSlots.map(day => {
            if (day._id === slotDayId) {
                return {
                    ...day,
                    slots: day.slots.map(s => 
                        s._id === slotId ? { ...s, isAvailable: !s.isAvailable } : s
                    )
                };
            }
            return day;
        });
        setAllSlots(updatedAllSlots);
       
        changeSlotAvailability(slotId, slotDayId)
            .catch(() => {
                toast.error("Failed to update slot availability. Please try again.");
                const originalSlotDay = allSlots.find(d => d._id === slotDayId);
                const originalSlot = originalSlotDay?.slots.find(s => s._id === slotId);
                if (originalSlot) {
                    const revertedSlots = allSlots.map(day => {
                        if (day._id === slotDayId) {
                            return {
                                ...day,
                                slots: day.slots.map(s => 
                                    s._id === slotId ? { ...s, isAvailable: originalSlot.isAvailable } : s
                                )
                            };
                        }
                        return day;
                    });
                    setAllSlots(revertedSlots);
                }
            });
    } 
    useEffect(() => {      
        fetchActiveSlots()   
    }, [dToken])
    const getSlotStats = () => {
        if (!allSlots || allSlots.length === 0) return { available: 0, booked: 0, unavailable: 0, total: 0 };
        
        let available = 0;
        let booked = 0;
        let unavailable = 0;
        let total = 0;
        
        allSlots.forEach(day => {
            if (day.slots) {
                day.slots.forEach(slot => {
                    if (slot.isBooked) booked++;
                    else if (slot.isAvailable) available++;
                    else unavailable++;
                    total++;
                });
            }
        });
        
        return { available, booked, unavailable, total };
    };
    
    const stats = getSlotStats();

    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointment Slots Management</h1>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left sidebar - Statistics */}
                    <div className="lg:w-1/3 xl:w-1/4 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition-all hover:shadow-md">
                            <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                                <FiClock className="mr-2 text-indigo-600" />
                                Slot Overview
                            </h2>
                            
                            {allSlots && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">Available</span>
                                                <span className="text-lg font-bold text-green-600">{stats.available}</span>
                                            </div>
                                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full transition-all duration-500" 
                                                    style={{width: `${stats.total ? (stats.available / stats.total) * 100 : 0}%`}}></div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">Booked</span>
                                                <span className="text-lg font-bold text-amber-600">{stats.booked}</span>
                                            </div>
                                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                                                    style={{width: `${stats.total ? (stats.booked / stats.total) * 100 : 0}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Unavailable</span>
                                            <span className="text-lg font-bold text-gray-600">{stats.unavailable}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-400 rounded-full transition-all duration-500" 
                                                style={{width: `${stats.total ? (stats.unavailable / stats.total) * 100 : 0}%`}}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <span className="font-medium text-indigo-900">Total Slots</span>
                                        <span className="text-xl font-bold text-indigo-700">{stats.total}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 mt-2">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-xs text-gray-600">Available</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                            <span className="text-xs text-gray-600">Booked</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                                            <span className="text-xs text-gray-600">Unavailable</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Main Content - Slots */}
                    <div className="lg:w-2/3 xl:w-3/4">
                        {/* No Slots Found */}
                        {!loading && allSlots.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-10 text-center min-h-[300px] flex flex-col items-center justify-center border border-gray-200 transition-all hover:shadow-md">
                                <div className="bg-amber-50 p-4 rounded-full mb-4">
                                    <FiCalendar className="w-12 h-12 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Appointment Slots Found</h3>
                                <p className="text-gray-500 max-w-md">
                                    Use the "Generate Slots" button to create new appointment slots.
                                </p>
                            </div>
                        )}

                        {/* Slots Display */}
                        {!loading && allSlots.length > 0 && (
                            <div className="space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto pr-2 custom-scrollbar">
                                {allSlots.map((slotDay) => (
                                    <div key={slotDay._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md">
                                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white sticky top-0 z-10">
                                            <div className="flex flex-wrap justify-between items-center">
                                                <h3 className="text-lg font-medium flex items-center">
                                                    <FiCalendar className="mr-2 text-indigo-200" />
                                                    {formatDate(slotDay.date)}
                                                </h3>
                                                <div className="flex space-x-3 text-xs mt-1 sm:mt-0">
                                                    <span className="px-3 py-1.5 bg-white/20 rounded-full flex items-center">
                                                        <FiCheckCircle className="mr-1.5" />
                                                        {slotDay.slots?.filter(s => s.isAvailable && !s.isBooked).length || 0} Available
                                                    </span>
                                                    <span className="px-3 py-1.5 bg-white/20 rounded-full flex items-center">
                                                        <FiAlertCircle className="mr-1.5" />
                                                        {slotDay.slots?.filter(s => s.isBooked).length || 0} Booked
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6">
                                            {slotDay.slots && slotDay.slots.length > 0 ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                                    {slotDay.slots.map((slot) => (
                                                        <div
                                                            key={slot._id} 
                                                            className={`
                                                                px-4 py-3 rounded-lg border flex justify-between items-center cursor-pointer text-sm
                                                                transition-all duration-200 transform hover:scale-105
                                                                ${slot.isBooked ? 
                                                                    'bg-amber-50 border-amber-200 cursor-not-allowed shadow-sm' : 
                                                                !slot.isAvailable ? 
                                                                    'bg-gray-50 border-gray-200 shadow-sm' : 
                                                                    'bg-green-50 border-green-200 hover:shadow-md hover:border-green-300'}
                                                            `}
                                                            onClick={() => slot.isBooked ? null : handelchangeSlotAvailability(slot._id, slotDay._id)}
                                                        >
                                                            <span className="font-medium">
                                                                {formatTime(slot.slotTime)}
                                                            </span>
                                                            <div className="flex items-center">
                                                                {slot.isBooked ? (
                                                                    <FiAlertCircle className="text-amber-500 w-4 h-4" />
                                                                ) : !slot.isAvailable ? (
                                                                    <FiXCircle className="text-gray-400 w-4 h-4" />
                                                                ) : (
                                                                    <FiCheckCircle className="text-green-500 w-4 h-4" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg border border-gray-200">
                                                    <p className="text-gray-500 text-sm flex items-center">
                                                        <FiClock className="mr-2 opacity-70" />
                                                        No time slots available for this day
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default MangeSolts_Doctor