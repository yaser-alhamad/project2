import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    fetchDoctoreSlots,
    allSlots,
  } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDayNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const getWeekdayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatTime = (timeString) => {
    try {
      if (timeString.includes("AM") || timeString.includes("PM")) {
        return timeString;
      }

      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    if (!selectedSlot || !selectedDay) {
      toast.error("Please select a slot and date");
      return;
    }
   
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        {
          docId,
          dayId: selectedDay._id,
          slotId: selectedSlot._id,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        // Optionally refresh doctor data or slots
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSlotSelect = (slot, date) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const getSlotStats = () => {
    if (!allSlots || allSlots.length === 0)
      return { available: 0, booked: 0, unavailable: 0, total: 0 };

    let available = 0;
    let booked = 0;
    let unavailable = 0;
    let total = 0;

    allSlots.forEach((day) => {
      if (day.slots) {
        day.slots.forEach((slot) => {
          if (slot.isBooked) booked++;
          else if (slot.isAvailable) available++;
          else unavailable++;
          total++;
        });
      }
    });

    return { available, booked, unavailable, total };
  };

  const getDayStats = (day) => {
    if (!day.slots) return { available: 0, booked: 0, total: 0 };

    let available = 0;
    let booked = 0;
    let total = 0;

    day.slots.forEach((slot) => {
      if (slot.isBooked) booked++;
      else if (slot.isAvailable) available++;
      total++;
    });

    return { available, booked, total };
  };

  // Get current week days for calendar display
  const getCurrentWeekDays = () => {
    const currentWeekSlots = getCurrentWeekSlots();
    if (!currentWeekSlots || currentWeekSlots.length === 0) return [];

    const days = [];
    currentWeekSlots.forEach((day) => {
      const dayStats = getDayStats(day);
      if (dayStats.available > 0) {
        days.push({
          date: new Date(day.date),
          isEmpty: false,
          data: day,
          dayNumber: formatDayNumber(day.date),
          weekday: getWeekdayName(day.date),
        });
      }
    });

    return days;
  };

  // Calculate week start (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get all available weeks from slot data
  const getAvailableWeeks = () => {
    if (!allSlots || allSlots.length === 0) return [];
    
    const weeks = new Set();
    allSlots.forEach(slotDay => {
      const slotDate = new Date(slotDay.date);
      const weekStart = getWeekStart(slotDate);
      weeks.add(weekStart.toISOString().split('T')[0]); // Store as YYYY-MM-DD string
    });
    
    return Array.from(weeks).sort().map(dateStr => new Date(dateStr));
  };

  // Navigate to next/previous week with data
  const navigateWeek = (direction) => {
    const availableWeeks = getAvailableWeeks();
    if (availableWeeks.length === 0) return;
    
    const currentWeekStartStr = getWeekStart(currentWeekStart).toISOString().split('T')[0];
    const currentIndex = availableWeeks.findIndex(week => 
      week.toISOString().split('T')[0] === currentWeekStartStr
    );
    
    let newIndex;
    if (currentIndex === -1) {
      // Current week not in data, go to first available week
      newIndex = 0;
    } else {
      newIndex = currentIndex + direction;
      if (newIndex < 0) newIndex = availableWeeks.length - 1;
      if (newIndex >= availableWeeks.length) newIndex = 0;
    }
    
    setCurrentWeekStart(availableWeeks[newIndex]);
  };

  // Check if navigation is possible
  const canNavigate = (direction) => {
    const availableWeeks = getAvailableWeeks();
    if (availableWeeks.length <= 1) return false;
    
    const currentWeekStartStr = getWeekStart(currentWeekStart).toISOString().split('T')[0];
    const currentIndex = availableWeeks.findIndex(week => 
      week.toISOString().split('T')[0] === currentWeekStartStr
    );
    
    if (currentIndex === -1) return true;
    
    const newIndex = currentIndex + direction;
    return newIndex >= 0 && newIndex < availableWeeks.length;
  };

  // Filter slots for current week
  const getCurrentWeekSlots = () => {
    if (!allSlots || allSlots.length === 0) return [];
    
    const weekStart = getWeekStart(currentWeekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return allSlots.filter(slotDay => {
      const slotDate = new Date(slotDay.date);
      return slotDate >= weekStart && slotDate <= weekEnd;
    });
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
    fetchDoctoreSlots(docId);
  }, [doctors, docId]);

  const stats = getSlotStats();

  return docInfo ? (
    <div>
      {/* ---------- Doctor Details ----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt=""
          />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* ----- Doc Info : name, degree, experience ----- */}

          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name}{" "}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          {/* ----- Doc About ----- */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currencySymbol}
              {docInfo.fees}
            </span>{" "}
          </p>
        </div>
      </div>

      {/* ---------- Appointment Slots Section ----------- */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-400 to-[#0d9f92] px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-semibold flex items-center text-white">
              <FiCalendar className="w-6 h-6 text-[#0d9488] " /> Available
              Appointment Slots
            </h2>
            <div className="flex space-x-4 text-xs mt-2 sm:mt-0">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white">
                {stats.available} Available
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white">
                {stats.booked} Booked
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {allSlots.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">
                <FiCalendar className="w-6 h-6 text-[#0d9488] " />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Appointment Slots Available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This doctor doesn&apos;t have any available appointment slots at
                the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Week Navigation */}
              {allSlots.length > 0 && (
                <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 rounded-lg p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center justify-between sm:justify-start space-x-4">
                      <button
                        onClick={() => navigateWeek(-1)}
                        disabled={!canNavigate(-1)}
                        className="p-2 rounded-lg bg-white hover:bg-teal-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-teal-200"
                      >
                        <FiChevronLeft className="w-5 h-5 text-teal-600" />
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
                        className="p-2 rounded-lg bg-white hover:bg-teal-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-teal-200"
                      >
                        <FiChevronRight className="w-5 h-5 text-teal-600" />
                      </button>
                    </div>

                    {/* Week Summary */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="w-4 h-4 text-teal-600" />
                        <span className="font-medium text-gray-700">
                          {getCurrentWeekSlots().length} days with slots
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">
                          {getCurrentWeekSlots().reduce((acc, day) => 
                            acc + (day.slots?.filter(s => s.isAvailable && !s.isBooked).length || 0), 0
                          )} available this week
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Days Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Select a Date:
                </h3>
                
                {/* Current Week Calendar */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                    {currentWeekStart.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h4>

                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-gray-500 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {getCurrentWeekDays().map((day, dayIndex) => {
                      const dayStats = getDayStats(day.data);
                      const isSelected = selectedDay?._id === day.data._id;

                      return (
                        <div
                          key={dayIndex}
                          className={`
                            h-14 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden
                            ${
                              isSelected
                                ? "border-teal-500 bg-gradient-to-br from-teal-50 to-indigo-50 shadow-lg shadow-teal-200/50 transform scale-105"
                                : "border-gray-200 bg-white hover:border-teal-300 hover:bg-gradient-to-br hover:from-teal-50 hover:to-indigo-50 hover:shadow-md hover:shadow-teal-100/50 hover:transform hover:scale-105"
                            }
                          `}
                          onClick={() => handleDaySelect(day.data)}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                          )}

                          <div
                            className={`text-sm font-semibold ${
                              isSelected ? "text-teal-700" : "text-gray-700"
                            }`}
                          >
                            {day.dayNumber}
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isSelected
                                ? "text-teal-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {dayStats.available} slots
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty week message */}
                  {getCurrentWeekDays().length === 0 && (
                    <div className="p-8 text-center">
                      <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-600 mb-1">No available slots this week</h3>
                      <p className="text-gray-500 text-sm">Use the navigation arrows to view other weeks</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Slots for Selected Day */}
              {selectedDay && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Time Slots for {formatDate(selectedDay.date)}:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {selectedDay.slots && selectedDay.slots.length > 0 ? (
                      selectedDay.slots.map((slot) => (
                        <div
                          key={slot._id}
                          className={`
                            p-3 rounded-lg border-2 text-center transition-all duration-200
                            ${
                              slot.isBooked
                                ? "bg-red-50 border-red-200 cursor-not-allowed text-red-700"
                                : !slot.isAvailable
                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                : selectedSlot?._id === slot._id
                                ? "bg-green-50 border-green-400 text-green-700 shadow-md"
                                : "bg-white border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-700 cursor-pointer hover:shadow-sm"
                            }
                          `}
                          onClick={() =>
                            !slot.isBooked &&
                            slot.isAvailable &&
                            handleSlotSelect(slot, selectedDay.date)
                          }
                        >
                          <div className="text-sm font-medium">
                            {formatTime(slot.slotTime)}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              slot.isBooked
                                ? "text-red-600"
                                : !slot.isAvailable
                                ? "text-gray-400"
                                : selectedSlot?._id === slot._id
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {slot.isBooked
                              ? "Booked"
                              : !slot.isAvailable
                              ? "Unavailable"
                              : "Available"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">
                          No time slots available for this date
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Book Appointment Button */}
              {selectedSlot && selectedDate && (
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r bg-gradient-to-r from-teal-50 to-[#7cc9c3] border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Selected Appointment:
                    </h4>
                    <p className="text-sm text-gray-700">
                      {formatDate(selectedDate)} at{" "}
                      {formatTime(selectedSlot.slotTime)}
                    </p>
                  </div>
                  <button
                    onClick={bookAppointment}
                    className="w-full bg-gradient-to-r from-teal-400 to-[#0d9f92] hover:to-[#0c8884] hover:from-teal-500  text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    Book Appointment - {currencySymbol}
                    {docInfo.fees}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listing Releated Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;