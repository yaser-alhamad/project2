import {useContext, useEffect} from 'react'
import {DoctorContext} from '../../context/DoctorContext'
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import { FaUserMd, FaRegCalendarAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const MangeSolts_Doctor = () => {
    const { dToken, changeSlotAvailability ,fetchActiveSlots,setAllSlots,allSlots} = useContext(DoctorContext)
    
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
        <div className="w-full min-h-screen bg-gray-50">
            {/* Clean Top Bar */}
            <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-teal-100 rounded-lg">
                                <FiCalendar className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Manage Appointment Slots</h1>
                                <p className="text-sm text-gray-600 mt-1">Create and manage your appointment schedule</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={fetchActiveSlots}
                                className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                <FiRefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Doctor Info Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-3">
                            <FaUserMd className="w-5 h-5 text-teal-600" />
                            <span className="text-sm font-semibold text-gray-700">Your Schedule</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <FiCalendar className="w-4 h-4 text-teal-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {stats.total} Total Slots
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <FiCheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                    {stats.available} Available
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <FiXCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {stats.unavailable} Unavailable
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <FiClock className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    {stats.booked} Booked
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                            <span className="hover:text-teal-600 cursor-pointer">Dashboard</span>
                            <span className="mx-2">/</span>
                            <span className="text-teal-600 font-medium">Slot Management</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Slots Display */}
                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {allSlots.length === 0 ? (
                        <div className="p-12 text-center">
                            <FaRegCalendarAlt className="w-16 h-16 text-teal-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                No Appointment Slots Found
                            </h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Contact the administrator to generate appointment slots for your schedule.
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                                {allSlots.map((slotDay) => (
                                    <div
                                        key={slotDay._id}
                                        className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="bg-teal-600 px-6 py-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                <h3 className="text-lg font-semibold flex items-center text-white">
                                                    <FiCalendar className="mr-2 text-teal-200" />
                                                    {formatDate(slotDay.date)}
                                                </h3>
                                                <div className="flex space-x-2 text-xs mt-2 sm:mt-0">
                                                    <span className="px-3 py-1 bg-white/20 rounded-full text-white">
                                                        {slotDay.slots?.filter((s) => s.isAvailable && !s.isBooked).length || 0} Available
                                                    </span>
                                                    <span className="px-3 py-1 bg-white/20 rounded-full text-white">
                                                        {slotDay.slots?.filter((s) => s.isBooked).length || 0} Booked
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            {slotDay.slots && slotDay.slots.length > 0 ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {slotDay.slots.map((slot) => (
                                                        <div
                                                            key={slot._id}
                                                            className={`
                                                                px-3 py-2 rounded-lg border-2 flex justify-between items-center cursor-pointer text-sm font-medium transition-all duration-200
                                                                ${slot.isBooked
                                                                    ? 'bg-amber-50 border-amber-200 cursor-not-allowed text-amber-700'
                                                                    : !slot.isAvailable
                                                                    ? 'bg-gray-50 border-gray-200 text-gray-500'
                                                                    : 'bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 text-green-700 hover:shadow-sm'
                                                                }
                                                            `}
                                                            onClick={() =>
                                                                !slot.isBooked && handelchangeSlotAvailability(slot._id, slotDay._id)
                                                            }
                                                        >
                                                            <span>{formatTime(slot.slotTime)}</span>
                                                            <span className={`
                                                                w-3 h-3 rounded-full
                                                                ${slot.isBooked
                                                                    ? 'bg-amber-500'
                                                                    : !slot.isAvailable
                                                                    ? 'bg-gray-400'
                                                                    : 'bg-green-500'
                                                                }
                                                            `}></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-16">
                                                    <p className="text-gray-500 text-sm">No time slots available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MangeSolts_Doctor