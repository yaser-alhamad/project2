<<<<<<< HEAD
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import Loading from '../../components/Loading'
=======
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import Loading from "../../components/Loading";
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
import {
  FiCalendar,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
<<<<<<< HEAD
} from 'react-icons/fi'
import { FaUserMd, FaRegCalendarAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const ManageSlots = () => {
  const {
    backendUrl,
    aToken,
    doctors,
    getAllDoctors,
    changeSlotAvailability,
  } = useContext(AdminContext)
  const [allSlots, setAllSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [doctorId, setDoctorId] = useState('')
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // Calculate week start (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  // Get all available weeks from slot data
  const getAvailableWeeks = () => {
    if (!allSlots.length) return []
    const weeks = new Set()
    allSlots.forEach((slotDay) => {
      const weekStart = getWeekStart(new Date(slotDay.date))
      weeks.add(weekStart.toISOString().split('T')[0])
    })
    return Array.from(weeks)
      .sort()
      .map((dateStr) => new Date(dateStr))
  }
=======
} from "react-icons/fi";
import { FaUserMd, FaRegCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageSlots = () => {
  const { backendUrl, aToken, doctors, getAllDoctors, changeSlotAvailability } =
    useContext(AdminContext);
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Calculate week start (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get all available weeks from slot data
  const getAvailableWeeks = () => {
    if (!allSlots.length) return [];

    const weeks = new Set();
    allSlots.forEach((slotDay) => {
      const slotDate = new Date(slotDay.date);
      const weekStart = getWeekStart(slotDate);
      weeks.add(weekStart.toISOString().split("T")[0]); // Store as YYYY-MM-DD string
    });

    return Array.from(weeks)
      .sort()
      .map((dateStr) => new Date(dateStr));
  };
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488

  // Navigate week
  const navigateWeek = (direction) => {
<<<<<<< HEAD
    const weeks = getAvailableWeeks()
    if (!weeks.length) return
    const currentStr = getWeekStart(currentWeekStart)
      .toISOString()
      .split('T')[0]
    const idx = weeks.findIndex(
      (w) => w.toISOString().split('T')[0] === currentStr
    )
    let newIdx = idx === -1 ? 0 : idx + direction
    if (newIdx < 0) newIdx = weeks.length - 1
    if (newIdx >= weeks.length) newIdx = 0
    setCurrentWeekStart(weeks[newIdx])
  }
=======
    const availableWeeks = getAvailableWeeks();
    if (availableWeeks.length === 0) return;

    const currentWeekStartStr = getWeekStart(currentWeekStart)
      .toISOString()
      .split("T")[0];
    const currentIndex = availableWeeks.findIndex(
      (week) => week.toISOString().split("T")[0] === currentWeekStartStr
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
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488

  const canNavigate = (direction) => {
<<<<<<< HEAD
    const weeks = getAvailableWeeks()
    if (weeks.length <= 1) return false
    const currentStr = getWeekStart(currentWeekStart)
      .toISOString()
      .split('T')[0]
    const idx = weeks.findIndex(
      (w) => w.toISOString().split('T')[0] === currentStr
    )
    const newIdx = idx + direction
    return newIdx >= 0 && newIdx < weeks.length
  }
=======
    const availableWeeks = getAvailableWeeks();
    if (availableWeeks.length <= 1) return false;

    const currentWeekStartStr = getWeekStart(currentWeekStart)
      .toISOString()
      .split("T")[0];
    const currentIndex = availableWeeks.findIndex(
      (week) => week.toISOString().split("T")[0] === currentWeekStartStr
    );

    if (currentIndex === -1) return true;

    const newIndex = currentIndex + direction;
    return newIndex >= 0 && newIndex < availableWeeks.length;
  };
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488

  const getCurrentWeekSlots = () => {
<<<<<<< HEAD
    if (!allSlots.length) return []
    const start = getWeekStart(currentWeekStart)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return allSlots.filter((day) => {
      const d = new Date(day.date)
      return d >= start && d <= end
    })
  }
=======
    if (!allSlots.length) return [];

    const weekStart = getWeekStart(currentWeekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return allSlots.filter((slotDay) => {
      const slotDate = new Date(slotDay.date);
      return slotDate >= weekStart && slotDate <= weekEnd;
    });
  };
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488

  const handleGenerateSlots = async () => {
    if (!doctorId) {
      toast.info("Please select a doctor first.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/generate-slots`,
        { doctorId },
        { headers: { aToken } }
<<<<<<< HEAD
      )
      if (data.success) {
        toast.success('Slots generated successfully')
        fetchActiveSlots()
      } else {
        toast.error(data.message || 'Failed to generate slots')
      }
    } catch {
      toast.error('An error occurred while generating slots')
=======
      );
      if (response.data.success) {
        toast.success("Slots generated successfully");
        fetchActiveSlots();
      } else {
        toast.error(response.data.message || "Failed to generate slots");
      }
    } catch (error) {
      console.error("Error generating slots:", error);
      toast.error("An error occurred while generating slots");
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
    }
    setLoading(false);
  };

  const fetchActiveSlots = async () => {
    if (!doctorId) {
      setAllSlots([]);
      return;
    }
<<<<<<< HEAD
    setLoading(true)
=======
    setLoading(true);
    setAllSlots([]);
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/get-slots/${doctorId}`,
        { headers: { aToken } }
<<<<<<< HEAD
      )
      setAllSlots(data.success ? data.slotsData || [] : [])
    } catch {
      setAllSlots([])
=======
      );
      if (response.data.success) {
        setAllSlots(response.data.slotsData || []);
      } else {
        setAllSlots([]);
      }
    } catch (error) {
      console.error("Error fetching active slots:", error);
      setAllSlots([]);
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
    }
    setLoading(false);
  };

<<<<<<< HEAD
  // Toggle availability optimistically
  const toggleSlot = (slotId, dayId) => {
    const day = allSlots.find((d) => d.id === dayId)
    if (!day) return
    const slot = day.slots.find((s) => s._id === slotId)
    if (!slot || slot.isBooked) return

    const updated = allSlots.map((d) =>
      d.id === dayId
        ? {
            ...d,
            slots: d.slots.map((s) =>
              s._id === slotId ? { ...s, isAvailable: !s.isAvailable } : s
            ),
          }
        : d
    )
    setAllSlots(updated)
    changeSlotAvailability(slotId, dayId).catch(() => {
      toast.error('Failed to update slot; reverting.')
      fetchActiveSlots()
    })
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

  const formatTime = (t) => {
    if (t.includes('AM') || t.includes('PM')) return t
    let [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
  }
=======
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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

  const handelchangeSlotAvailability = (slotId, slotDayId) => {
    const slotDay = allSlots.find((slot) => slot.id === slotDayId);
    if (!slotDay) return;
    const slot = slotDay.slots.find((s) => s._id === slotId);
    if (!slot || slot.isBooked) return;

    const updatedAllSlots = allSlots.map((day) => {
      if (day.id === slotDayId) {
        return {
          ...day,
          slots: day.slots.map((s) =>
            s._id === slotId ? { ...s, isAvailable: !s.isAvailable } : s
          ),
        };
      }
      return day;
    });
    setAllSlots(updatedAllSlots);

    changeSlotAvailability(slotId, slotDayId).catch(() => {
      toast.error("Failed to update slot availability. Please try again.");
      const originalSlotDay = allSlots.find((d) => d.id === slotDayId);
      const originalSlot = originalSlotDay?.slots.find((s) => s._id === slotId);
      if (originalSlot) {
        const revertedSlots = updatedAllSlots.map((day) => {
          if (day.id === slotDayId) {
            return {
              ...day,
              slots: day.slots.map((s) =>
                s._id === slotId
                  ? { ...s, isAvailable: originalSlot.isAvailable }
                  : s
              ),
            };
          }
          return day;
        });
        setAllSlots(revertedSlots);
      }
    });
  };

  // Get day status for highlighting
  const getDayStatus = (slotDay) => {
    if (!slotDay.slots || slotDay.slots.length === 0) return "empty";

    const available = slotDay.slots.filter(
      (s) => s.isAvailable && !s.isBooked
    ).length;
    const booked = slotDay.slots.filter((s) => s.isBooked).length;

    if (available === 0 && booked === 0) return "unavailable";
    if (booked > 0 && available === 0) return "fully-booked";
    if (booked > 0) return "partially-booked";
    return "available";
  };
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488

  useEffect(() => {
    getAllDoctors();
  }, [aToken]);

  useEffect(() => {
    fetchActiveSlots();
  }, [doctorId, aToken]);

<<<<<<< HEAD
  const stats = getCurrentWeekSlots().reduce(
    (acc, day) => {
      day.slots.forEach((s) => {
        acc.total++
        if (s.isBooked) acc.booked++
        else if (s.isAvailable) acc.available++
        else acc.unavailable++
      })
      return acc
    },
    { total: 0, booked: 0, available: 0, unavailable: 0 }
  )

  const currentWeekSlots = getCurrentWeekSlots()
=======
  const selectedDoctorDetails =
    doctorId && allSlots.length > 0 && allSlots[0]?.doctorInfo
      ? allSlots[0].doctorInfo
      : null;

  const getSlotStats = () => {
    if (!allSlots || allSlots.length === 0)
      return { available: 0, booked: 0, unavailable: 0, total: 0 };

    let available = 0;
    let booked = 0;
    let unavailable = 0;
    let total = 0;

    allSlots.forEach((day) => {
      day.slots?.forEach((slot) => {
        if (slot.isBooked) booked++;
        else if (slot.isAvailable) available++;
        else unavailable++;
        total++;
      });
    });

    return { available, booked, unavailable, total };
  };

  const stats = getSlotStats();
  const currentWeekSlots = getCurrentWeekSlots();
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Title + Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-teal-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Slot Management
                </h1>
                <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                  Create and manage doctor appointment schedules
                </p>
              </div>
            </div>
<<<<<<< HEAD
=======

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {doctorId && (
                <button
                  onClick={handleGenerateSlots}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FiPlus className="w-4 h-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">
<<<<<<< HEAD
                    {loading ? 'Creating...' : 'Create Slots'}
                  </span>
                  <span className="sm:hidden">
                    {loading ? 'Creating...' : 'Create'}
                  </span>
                </button>
              )}
=======
                    {loading ? "Creating..." : "Create Slots"}
                  </span>
                  <span className="sm:hidden">
                    {loading ? "Creating..." : "Create"}
                  </span>
                </button>
              )}

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
              <button
                onClick={fetchActiveSlots}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Sync</span>
              </button>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mt-4 overflow-visible">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 overflow-visible">
              <div className="flex items-center space-x-2">
                <FaUserMd className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Select Doctor:
                </span>
<<<<<<< HEAD
              </div>
              <div className="overflow-visible">
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="relative px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors sm:min-w-[280px]"
                >
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} ({doc.speciality})
                    </option>
                  ))}
                </select>
=======
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
              </div>
            </div>

            {/* Selected Doctor Info */}
            {allSlots.length > 0 && allSlots[0]?.doctorInfo && (
              <div className="flex items-center justify-center lg:justify-end">
                <div className="flex items-center space-x-3 bg-teal-50 px-4 py-2.5 rounded-lg border border-teal-200">
                  <FaUserMd className="w-5 h-5 text-teal-600" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-sm font-medium text-teal-800">
                      Dr. {allSlots[0].doctorInfo.name}
                    </span>
                    <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                      {allSlots[0].doctorInfo.speciality}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {doctors.length} Doctors
                </span>
              </div>
<<<<<<< HEAD
=======

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
              {doctorId && (
                <>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {stats.total} Total Slots
                    </span>
                  </div>
<<<<<<< HEAD
=======

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                  <div className="flex items-center space-x-2">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {stats.available} Available
                    </span>
                  </div>
<<<<<<< HEAD
=======

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                  <div className="flex items-center space-x-2">
                    <FiXCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {stats.unavailable} Unavailable
                    </span>
                  </div>
<<<<<<< HEAD
=======

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {stats.booked} Booked
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="hover:text-teal-600 cursor-pointer">
                Dashboard
              </span>
              <span className="mx-2">/</span>
              <span className="text-teal-600 font-medium">Slot Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
<<<<<<< HEAD
        {doctorId && allSlots.length > 0 ? (
          <>
            {/* Week nav */}
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentWeekStart.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Week of{' '}
                      {getWeekStart(currentWeekStart).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}{' '}
                      -{' '}
                      {new Date(
                        getWeekStart(currentWeekStart).getTime() +
                          6 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
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
                      {currentWeekSlots.reduce(
                        (acc, day) =>
                          acc +
                          (day.slots.filter(
                            (s) => s.isAvailable && !s.isBooked
                          ).length || 0),
                        0
                      )}{' '}
                      available this week
                    </span>
                  </div>
=======
        {/* Week Navigation */}
        {doctorId && allSlots.length > 0 && (
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
                    {currentWeekStart.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Week of{" "}
                    {getWeekStart(currentWeekStart).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}{" "}
                    -{" "}
                    {new Date(
                      getWeekStart(currentWeekStart).getTime() +
                        6 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
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
                    {currentWeekSlots.reduce(
                      (acc, day) =>
                        acc +
                        (day.slots?.filter((s) => s.isAvailable && !s.isBooked)
                          .length || 0),
                      0
                    )}{" "}
                    available this week
                  </span>
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                </div>
              </div>
            </div>

<<<<<<< HEAD
            {/* Slots Grid */}
=======
        {/* Slots Display */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loading />
              <p className="text-teal-700 mt-4 font-medium">
                Loading appointment slots...
              </p>
            </div>
          ) : !doctorId ? (
            <div className="p-12 text-center">
              <FaRegCalendarAlt className="w-16 h-16 text-teal-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Doctor
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Please select a physician from the dropdown to manage their
                appointment schedule.
              </p>
            </div>
          ) : allSlots.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Appointment Slots Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Use the &quot;Create Slots&quot; button to create new
                appointment slots.
              </p>
            </div>
          ) : (
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6">
                {currentWeekSlots.map((slotDay) => {
<<<<<<< HEAD
                  const status = (() => {
                    const avail = slotDay.slots.filter(
                      (s) => s.isAvailable && !s.isBooked
                    ).length
                    const booked = slotDay.slots.filter((s) => s.isBooked)
                      .length
                    if (!slotDay.slots.length) return 'empty'
                    if (booked > 0 && avail === 0) return 'fully-booked'
                    if (booked > 0) return 'partially-booked'
                    if (avail === 0) return 'unavailable'
                    return 'available'
                  })()
=======
                  const dayStatus = getDayStatus(slotDay);

>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                  return (
                    <div
                      key={slotDay.id}
                      className={`
                        bg-gray-50 rounded-xl border-2 overflow-hidden hover:shadow-md transition-all duration-200
                        ${
<<<<<<< HEAD
                          status === 'empty'
                            ? 'border-gray-200'
                            : status === 'unavailable'
                            ? 'border-red-200 bg-red-50'
                            : status === 'fully-booked'
                            ? 'border-amber-200 bg-amber-50'
                            : status === 'partially-booked'
                            ? 'border-orange-200 bg-orange-50'
                            : 'border-green-200 bg-green-50'
=======
                          dayStatus === "empty"
                            ? "border-gray-200"
                            : dayStatus === "unavailable"
                            ? "border-red-200 bg-red-50"
                            : dayStatus === "fully-booked"
                            ? "border-amber-200 bg-amber-50"
                            : dayStatus === "partially-booked"
                            ? "border-orange-200 bg-orange-50"
                            : "border-green-200 bg-green-50"
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                        }
                      `}
                    >
                      <div
                        className={`
<<<<<<< HEAD
                          px-4 py-3
                          ${
                            status === 'empty'
                              ? 'bg-gray-600'
                              : status === 'unavailable'
                              ? 'bg-red-600'
                              : status === 'fully-booked'
                              ? 'bg-amber-600'
                              : status === 'partially-booked'
                              ? 'bg-orange-600'
                              : 'bg-green-600'
                          }
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-semibold text-white flex items-center">
                            <FiCalendar className="mr-2 text-white/80" />
                            {formatDate(slotDay.date)}
                          </h3>
                          <div className="flex items-center">
                            {status === 'unavailable' && (
                              <FiXCircle className="w-4 h-4 text-red-200 mr-1" />
                            )}
                            {status === 'fully-booked' && (
                              <FiClock className="w-4 h-4 text-amber-200 mr-1" />
                            )}
                            {status === 'partially-booked' && (
                              <FiAlertTriangle className="w-4 h-4 text-orange-200 mr-1" />
                            )}
                            <span className="text-xs text-white/90 font-medium">
                              {status === 'unavailable'
                                ? 'No slots'
                                : status === 'fully-booked'
                                ? 'Fully booked'
                                : status === 'partially-booked'
                                ? 'Partially booked'
                                : 'Available'}
                            </span>
                          </div>
=======
                        px-4 py-3
                        ${
                          dayStatus === "empty"
                            ? "bg-gray-600"
                            : dayStatus === "unavailable"
                            ? "bg-red-600"
                            : dayStatus === "fully-booked"
                            ? "bg-amber-600"
                            : dayStatus === "partially-booked"
                            ? "bg-orange-600"
                            : "bg-green-600"
                        }
                      `}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h3 className="text-base font-semibold flex items-center text-white">
                            <FiCalendar className="mr-2 text-white/80" />
                            {formatDate(slotDay.date)}
                          </h3>

                          {/* Status indicator */}
                          {dayStatus !== "available" && (
                            <div className="flex items-center mt-2 sm:mt-0">
                              {dayStatus === "unavailable" && (
                                <FiXCircle className="w-4 h-4 text-red-200 mr-1" />
                              )}
                              {dayStatus === "fully-booked" && (
                                <FiClock className="w-4 h-4 text-amber-200 mr-1" />
                              )}
                              {dayStatus === "partially-booked" && (
                                <FiAlertTriangle className="w-4 h-4 text-orange-200 mr-1" />
                              )}
                              <span className="text-xs text-white/90 font-medium">
                                {dayStatus === "unavailable"
                                  ? "No slots"
                                  : dayStatus === "fully-booked"
                                  ? "Fully booked"
                                  : dayStatus === "partially-booked"
                                  ? "Partially booked"
                                  : "Available"}
                              </span>
                            </div>
                          )}
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                        </div>
                      </div>
                      <div className="p-3">
                        {slotDay.slots.length ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {slotDay.slots.map((s) => (
                              <div
                                key={s._id}
                                onClick={() =>
                                  !s.isBooked &&
                                  toggleSlot(s._id, slotDay.id)
                                }
                                title={
                                  s.isBooked
                                    ? 'Booked'
                                    : !s.isAvailable
                                    ? 'Unavailable'
                                    : 'Click to toggle availability'
                                }
                                className={`
                                  px-2 py-1.5 rounded-md border text-xs font-medium flex justify-between items-center cursor-pointer transition-all duration-200
                                  ${
<<<<<<< HEAD
                                    s.isBooked
                                      ? 'bg-amber-100 border-amber-300 text-amber-800 cursor-not-allowed'
                                      : !s.isAvailable
                                      ? 'bg-gray-100 border-gray-300 text-gray-600'
                                      : 'bg-green-100 border-green-300 hover:border-green-400 hover:bg-green-200 text-green-800'
                                  }
                                `}
                              >
                                <span className="truncate">
                                  {formatTime(s.slotTime)}
                                </span>
                                <span
                                  className={`
                                    w-2 h-2 rounded-full flex-shrink-0 ml-1
                                    ${
                                      s.isBooked
                                        ? 'bg-amber-500'
                                        : !s.isAvailable
                                        ? 'bg-gray-400'
                                        : 'bg-green-500'
                                    }
                                  `}
                                />
=======
                                    slot.isBooked
                                      ? "bg-amber-100 border-amber-300 cursor-not-allowed text-amber-800"
                                      : !slot.isAvailable
                                      ? "bg-gray-100 border-gray-300 text-gray-600"
                                      : "bg-green-100 border-green-300 hover:border-green-400 hover:bg-green-200 text-green-800"
                                  }
                                `}
                                onClick={() =>
                                  !slot.isBooked &&
                                  handelchangeSlotAvailability(
                                    slot._id,
                                    slotDay.id
                                  )
                                }
                                title={
                                  slot.isBooked
                                    ? "Booked"
                                    : !slot.isAvailable
                                    ? "Unavailable"
                                    : "Click to toggle availability"
                                }
                              >
                                <span className="truncate">
                                  {formatTime(slot.slotTime)}
                                </span>
                                <span
                                  className={`
                                  w-2 h-2 rounded-full flex-shrink-0 ml-1
                                  ${
                                    slot.isBooked
                                      ? "bg-amber-500"
                                      : !slot.isAvailable
                                      ? "bg-gray-400"
                                      : "bg-green-500"
                                  }
                                `}
                                ></span>
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                              </div>
                            ))}
                          </div>
                        ) : (
<<<<<<< HEAD
                          <div className="h-12 flex items-center justify-center">
=======
                          <div className="flex items-center justify-center h-12">
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
                            <p className="text-gray-500 text-sm">
                              No time slots
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
<<<<<<< HEAD
=======

              {/* Empty week message */}
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
              {currentWeekSlots.length === 0 && (
                <div className="p-12 text-center">
                  <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600 mb-1">
                    No slots this week
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Use the navigation arrows to view other weeks
                  </p>
                </div>
              )}
            </div>
          </>
        ) : loading ? (
          <div className="p-12 flex flex-col items-center">
            <Loading />
            <p className="text-teal-700 mt-4 font-medium">
              Loading appointment slots...
            </p>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FaRegCalendarAlt className="w-16 h-16 text-teal-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Select a Doctor
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Please select a physician from the dropdown to manage their
              appointment schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ManageSlots
=======
export default ManageSlots;
>>>>>>> cf5c1c256f63270edc172fcbac9b0c1c69ac1488
