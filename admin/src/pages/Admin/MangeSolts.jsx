import {useContext, useState, useEffect} from 'react'
import axios from 'axios'
import {AdminContext} from '../../context/AdminContext'
import Loading from '../../components/Loading'
import { FiCalendar, FiPlus } from 'react-icons/fi'
import { FaUserMd, FaRegCalendarAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const MangeSolts = () => {
    const {backendUrl, aToken, doctors, getAllDoctors, changeSlotAvailability} = useContext(AdminContext)
    const [allSlots, setAllSlots] = useState([])
    const [loading, setLoading] = useState(false)
    const [doctorId, setDoctorId] = useState('')
    
    const handleGenerateSlots = async () => {
        if (!doctorId) {
            toast.info('Please select a doctor first.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(backendUrl+'/api/admin/generate-slots', {doctorId}, {headers: {aToken}})
            if (response.data.success) {
                toast.success('Slots generated successfully')
                fetchActiveSlots()
            } else {
                toast.error(response.data.message || 'Failed to generate slots')
            }
        } catch (error) {
            console.error("Error generating slots:", error)
            toast.error('An error occurred while generating slots')
        }
    }

   const fetchActiveSlots = async () => {
        if (!doctorId) {
            setAllSlots([]);
            return;
        }
        setLoading(true)
        setAllSlots([])
        try {
            const response = await axios.get(backendUrl+`/api/admin/get-slots/${doctorId}`, {headers: {aToken}})
            if (response.data.success) {
                setAllSlots(response.data.slotsData || [])
            } else {
                setAllSlots([])
            }
        } catch (error) {
            console.error("Error fetching active slots:", error)
            setAllSlots([])
        }
        setLoading(false)
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
        const slotDay = allSlots.find(slot => slot.id === slotDayId)
        if (!slotDay) return;
        const slot = slotDay.slots.find(s => s._id === slotId)
        if (!slot || slot.isBooked) {
            return;
        }
        const updatedAllSlots = allSlots.map(day => {
            if (day.id === slotDayId) {
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
                const originalSlotDay = allSlots.find(d => d.id === slotDayId);
                const originalSlot = originalSlotDay?.slots.find(s => s._id === slotId);
                if (originalSlot) {
                    const revertedSlots = updatedAllSlots.map(day => {
                        if (day.id === slotDayId) {
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
        getAllDoctors()
    }, [aToken])

    useEffect(() => {
        fetchActiveSlots()
    }, [doctorId, aToken])
  
    const selectedDoctorDetails = doctorId && allSlots.length > 0 && allSlots[0]?.doctorInfo ? allSlots[0].doctorInfo : null;

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
        <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left sidebar */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-lg shadow-md p-5 mb-4 border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-teal-700">Manage Appointments</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Select Doctor</label>
                            <select 
                                value={doctorId} 
                                onChange={(e) => {setDoctorId(e.target.value)}}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                            >
                                <option value="">-- Select Doctor --</option>
                                {doctors.map(doctor => (
                                    <option key={doctor._id} value={doctor._id}>
                                        Dr. {doctor.name} ({doctor.speciality})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedDoctorDetails && (
                            <div className="mb-4 p-4 bg-teal-50 rounded-md border border-teal-100">
                                <div className="flex items-center">
                                    <FaUserMd className="text-teal-600 mr-3 text-lg" />
                                    <div>
                                        <p className="font-semibold text-teal-800">Dr. {selectedDoctorDetails.name}</p>
                                        <p className="text-sm text-gray-600">{selectedDoctorDetails.speciality}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <button 
                            type="button" 
                            className="w-full py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow"
                            disabled={!doctorId || loading}
                            onClick={handleGenerateSlots}
                        >
                            <FiPlus className="w-4 h-4" />
                            Generate Slots
                        </button>
                    </div>
                    
                    {doctorId && (
                        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
                            <h3 className="font-medium mb-4 text-gray-700 border-b pb-2">Slot Statistics</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Available</span>
                                        <span className="font-semibold text-green-600">{stats.available}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full">
                                        <div className="h-2 bg-green-500 rounded-full" style={{width: `${stats.total ? (stats.available / stats.total) * 100 : 0}%`}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Booked</span>
                                        <span className="font-semibold text-amber-600">{stats.booked}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full">
                                        <div className="h-2 bg-amber-500 rounded-full" style={{width: `${stats.total ? (stats.booked / stats.total) * 100 : 0}%`}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Unavailable</span>
                                        <span className="font-semibold text-gray-600">{stats.unavailable}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full">
                                        <div className="h-2 bg-gray-400 rounded-full" style={{width: `${stats.total ? (stats.unavailable / stats.total) * 100 : 0}%`}}></div>
                                    </div>
                                </div>
                                
                                <div className="pt-3 border-t mt-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Total Slots</span>
                                        <span>{stats.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Main Content */}
                <div className="lg:w-3/4">
                    {/* Loading State */}
                    {loading && (
                        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center min-h-[300px] border border-gray-100">
                            <Loading />
                            <p className="text-teal-600 mt-4 font-medium">Loading appointment slots...</p>
                        </div>
                    )}

                    {/* No Doctor Selected */}
                    {!loading && !doctorId && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center min-h-[300px] flex flex-col items-center justify-center border border-gray-100">
                            <FaRegCalendarAlt className="w-14 h-14 text-teal-400 mb-4 opacity-80" />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a Doctor</h2>
                            <p className="text-gray-500 max-w-md">
                                Please select a physician from the sidebar to manage their appointment schedule.
                            </p>
                        </div>
                    )}

                    {/* No Slots Found */}
                    {!loading && doctorId && allSlots.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center min-h-[300px] flex flex-col items-center justify-center border border-gray-100">
                            <FiCalendar className="w-14 h-14 text-amber-400 mb-4 opacity-80" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointment Slots Found</h3>
                            <p className="text-gray-500 max-w-md">
                                Use the &quot;Generate Slots&quot; button to create new appointment slots.
                            </p>
                        </div>
                    )}

                    {/* Slots Display */}
                    {!loading && allSlots.length > 0 && (
                        <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                            {allSlots.map((slotDay) => (
                                <div key={slotDay.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                    <div className="bg-teal-600 px-5 py-3.5 text-white sticky top-0 z-10">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <h3 className="text-base font-medium flex items-center">
                                                <FiCalendar className="mr-2 text-teal-100" />
                                                {formatDate(slotDay.date)}
                                            </h3>
                                            <div className="flex space-x-2 text-xs mt-1 sm:mt-0">
                                                <span className="px-2.5 py-1 bg-white/20 rounded-full">
                                                    {slotDay.slots?.filter(s => s.isAvailable && !s.isBooked).length || 0} Available
                                                </span>
                                                <span className="px-2.5 py-1 bg-white/20 rounded-full">
                                                    {slotDay.slots?.filter(s => s.isBooked).length || 0} Booked
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        {slotDay.slots && slotDay.slots.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                                {slotDay.slots.map((slot) => (
                                                    <div
                                                        key={slot._id} 
                                                        className={`
                                                            px-3 py-2 rounded-md border flex justify-between items-center cursor-pointer text-sm
                                                            ${slot.isBooked ? 
                                                                'bg-amber-50 border-amber-200 cursor-not-allowed' : 
                                                            !slot.isAvailable ? 
                                                                'bg-gray-50 border-gray-200' : 
                                                                'bg-green-50 border-green-200 hover:shadow-md transition'}
                                                        `}
                                                        onClick={() => slot.isBooked ? null : handelchangeSlotAvailability(slot._id, slotDay.id)}
                                                    >
                                                        <span className="font-medium">
                                                            {formatTime(slot.slotTime)}
                                                        </span>
                                                        <span className={`
                                                            w-3 h-3 rounded-full
                                                            ${slot.isBooked ? 
                                                                'bg-amber-500' :
                                                            !slot.isAvailable ? 
                                                                'bg-gray-400' : 
                                                                'bg-green-500'}
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default MangeSolts