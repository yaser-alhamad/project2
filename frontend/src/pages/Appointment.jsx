import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import { FiCalendar } from "react-icons/fi";

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctosData,
    fetchDoctoreSlots,
    allSlots,
  } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

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

  const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
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

    if (!selectedSlot || !selectedDate) {
      toast.error("Please select a slot and date");
      return;
    }

    const date = new Date(selectedDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const slotDate = day + "_" + month + "_" + year;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        {
          docId,
          slotDate,
          slotTime: selectedSlot.slotTime,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctosData();
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

  const groupSlotsByMonth = () => {
    if (!allSlots || allSlots.length === 0) return [];

    const grouped = {};
    allSlots.forEach((day) => {
      const monthKey = formatMonthYear(day.date);
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(day);
    });

    return Object.entries(grouped).map(([month, days]) => ({
      month,
      days: days.sort((a, b) => new Date(a.date) - new Date(b.date)),
    }));
  };

  const getCalendarDays = (monthDays) => {
    if (!monthDays || monthDays.length === 0) return [];

    // Only include days that have available slots
    const availableDays = monthDays.filter((day) => {
      const dayStats = getDayStats(day);
      return dayStats.available > 0;
    });

    if (availableDays.length === 0) return [];

    const days = [];

    // Add only available days
    availableDays.forEach((day) => {
      days.push({
        date: new Date(day.date),
        isEmpty: false,
        data: day,
        dayNumber: formatDayNumber(day.date),
        weekday: getWeekdayName(day.date),
      });
    });

    return days;
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
              {/* Days Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Select a Date:
                </h3>
                {groupSlotsByMonth().map((monthData, monthIndex) => {
                  const availableDays = getCalendarDays(monthData.days);
                  if (availableDays.length === 0) return null;

                  return (
                    <div key={monthIndex} className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                        {monthData.month}
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
                        {availableDays.map((day, dayIndex) => {
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

                      {/* Calendar Legend */}
                      {/* <div className="flex justify-center space-x-6 mt-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-teal-50 to-indigo-50 border-2 border-purple-500 rounded-lg shadow-sm relative">
                            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          </div>
                          <span>Selected</span>
                        </div>
                      </div> */}
                    </div>
                  );
                })}
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
                                                            : selectedSlot?._id ===
                                                              slot._id
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
