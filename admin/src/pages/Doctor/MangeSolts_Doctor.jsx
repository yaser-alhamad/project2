import {useContext, useEffect, useState} from 'react'
import {DoctorContext} from '../../context/DoctorContext'
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi'
import { FaUserMd, FaRegCalendarAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const MangeSolts_Doctor = () => {
    const { dToken, changeSlotAvailability ,fetchActiveSlots,setAllSlots,allSlots} = useContext(DoctorContext)
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
    
    // Helper: get start of week (Monday)
    const getWeekStart = (date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as start
        return new Date(d.setDate(diff))
    }

    // Helper: get all available week starts from allSlots
    const getAvailableWeeks = () => {
        if (!allSlots.length) return []
        const weeks = new Set()
        allSlots.forEach(slotDay => {
            const slotDate = new Date(slotDay.date)
            const weekStart = getWeekStart(slotDate)
            weeks.add(weekStart.toISOString().split('T')[0])
        })
        return Array.from(weeks).sort().map(dateStr => new Date(dateStr))
    }

    // Helper: navigate to next/prev week
    const navigateWeek = (direction) => {
        const availableWeeks = getAvailableWeeks()
        if (availableWeeks.length === 0) return
        const currentWeekStartStr = getWeekStart(currentWeekStart).toISOString().split('T')[0]
        const currentIndex = availableWeeks.findIndex(week => week.toISOString().split('T')[0] === currentWeekStartStr)
        let newIndex
        if (currentIndex === -1) {
            newIndex = 0
        } else {
            newIndex = currentIndex + direction
            if (newIndex < 0) newIndex = availableWeeks.length - 1
            if (newIndex >= availableWeeks.length) newIndex = 0
        }
        setCurrentWeekStart(availableWeeks[newIndex])
    }

    // Helper: can navigate to next/prev week
    const canNavigate = (direction) => {
        const availableWeeks = getAvailableWeeks()
        if (availableWeeks.length <= 1) return false
        const currentWeekStartStr = getWeekStart(currentWeekStart).toISOString().split('T')[0]
        const currentIndex = availableWeeks.findIndex(week => week.toISOString().split('T')[0] === currentWeekStartStr)
        if (currentIndex === -1) return true
        const newIndex = currentIndex + direction
        return newIndex >= 0 && newIndex < availableWeeks.length
    }

    // Helper: filter slots for current week
    const getCurrentWeekSlots = () => {
        if (!allSlots.length) return []
        const weekStart = getWeekStart(currentWeekStart)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        return allSlots.filter(slotDay => {
            const slotDate = new Date(slotDay.date)
            return slotDate >= weekStart && slotDate <= weekEnd
        })
    }

    // Helper: get day status for highlighting
    const getDayStatus = (slotDay) => {
        if (!slotDay.slots || slotDay.slots.length === 0) return 'empty'
        const available = slotDay.slots.filter(s => s.isAvailable && !s.isBooked).length
        const booked = slotDay.slots.filter(s => s.isBooked).length
        if (available === 0 && booked === 0) return 'unavailable'
        if (booked > 0 && available === 0) return 'fully-booked'
        if (booked > 0) return 'partially-booked'
        return 'available'
    }

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
    const currentWeekSlots = getCurrentWeekSlots();

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Clean Top Bar */}
            <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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
                {/* Week Navigation */}
                {allSlots.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center justify-between sm:justify-start space-x-4">
                                <button
                                    onClick={() => navigateWeek(-1)}
                                    disabled={!canNavigate(-1)}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                
                                <div className="text-center sm:text-left">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {currentWeekStart.toLocaleDateString('en-US', { 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Week of {getWeekStart(currentWeekStart).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })} - {new Date(getWeekStart(currentWeekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                
                                <button
                                    onClick={() => navigateWeek(1)}
                                    disabled={!canNavigate(1)}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Week Summary */}
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <FiCalendar className="w-4 h-4 text-teal-600" />
                                    <span className="font-medium text-gray-700">
                                        {currentWeekSlots.length} days with slots
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700">
                                        {currentWeekSlots.reduce((acc, day) => 
                                            acc + (day.slots?.filter(s => s.isAvailable && !s.isBooked).length || 0), 0
                                        )} available this week
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6">
                                {currentWeekSlots.map((slotDay) => {
                                    const dayStatus = getDayStatus(slotDay)
                                    
                                    return (
                                        <div
                                            key={slotDay._id}
                                            className={`
                                                bg-gray-50 rounded-xl border-2 overflow-hidden hover:shadow-md transition-all duration-200
                                                ${dayStatus === 'empty' ? 'border-gray-200' :
                                                    dayStatus === 'unavailable' ? 'border-red-200 bg-red-50' :
                                                    dayStatus === 'fully-booked' ? 'border-amber-200 bg-amber-50' :
                                                    dayStatus === 'partially-booked' ? 'border-orange-200 bg-orange-50' :
                                                    'border-green-200 bg-green-50'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                px-4 py-3
                                                ${dayStatus === 'empty' ? 'bg-gray-600' :
                                                    dayStatus === 'unavailable' ? 'bg-red-600' :
                                                    dayStatus === 'fully-booked' ? 'bg-amber-600' :
                                                    dayStatus === 'partially-booked' ? 'bg-orange-600' :
                                                    'bg-green-600'
                                                }
                                            `}>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                    <h3 className="text-base font-semibold flex items-center text-white">
                                                        <FiCalendar className="mr-2 text-white/80" />
                                                        {formatDate(slotDay.date)}
                                                    </h3>
                                                    
                                                    {/* Status indicator */}
                                                    {dayStatus !== 'available' && (
                                                        <div className="flex items-center mt-2 sm:mt-0">
                                                            {dayStatus === 'unavailable' && (
                                                                <FiXCircle className="w-4 h-4 text-red-200 mr-1" />
                                                            )}
                                                            {dayStatus === 'fully-booked' && (
                                                                <FiClock className="w-4 h-4 text-amber-200 mr-1" />
                                                            )}
                                                            {dayStatus === 'partially-booked' && (
                                                                <FiAlertTriangle className="w-4 h-4 text-orange-200 mr-1" />
                                                            )}
                                                            <span className="text-xs text-white/90 font-medium">
                                                                {dayStatus === 'unavailable' ? 'No slots' :
                                                                dayStatus === 'fully-booked' ? 'Fully booked' :
                                                                dayStatus === 'partially-booked' ? 'Partially booked' : 'Available'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                {slotDay.slots && slotDay.slots.length > 0 ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                                        {slotDay.slots.map((slot) => (
                                                            <div
                                                                key={slot._id}
                                                                className={`
                                                                    px-2 py-1.5 rounded-md border text-xs font-medium flex justify-between items-center cursor-pointer transition-all duration-200
                                                                    ${slot.isBooked
                                                                        ? 'bg-amber-100 border-amber-300 cursor-not-allowed text-amber-800'
                                                                        : !slot.isAvailable
                                                                        ? 'bg-gray-100 border-gray-300 text-gray-600'
                                                                        : 'bg-green-100 border-green-300 hover:border-green-400 hover:bg-green-200 text-green-800'
                                                                    }
                                                                `}
                                                                onClick={() =>
                                                                    !slot.isBooked && handelchangeSlotAvailability(slot._id, slotDay._id)
                                                                }
                                                                title={slot.isBooked ? 'Booked' : !slot.isAvailable ? 'Unavailable' : 'Click to toggle availability'}
                                                            >
                                                                <span className="truncate">{formatTime(slot.slotTime)}</span>
                                                                <span className={`
                                                                    w-2 h-2 rounded-full flex-shrink-0 ml-1
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
                                                    <div className="flex items-center justify-center h-12">
                                                        <p className="text-gray-500 text-sm">No time slots</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {/* Empty week message */}
                            {currentWeekSlots.length === 0 && (
                                <div className="p-12 text-center">
                                    <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-1">No slots this week</h3>
                                    <p className="text-gray-500 text-sm">Use the navigation arrows to view other weeks</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MangeSolts_Doctor