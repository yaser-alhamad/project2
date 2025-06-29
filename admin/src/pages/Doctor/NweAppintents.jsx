import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiFilePlus,
} from "react-icons/fi";
import { FaFileMedical } from "react-icons/fa6";
import { BsFileEarmarkPlus } from "react-icons/bs";
const DoctorAppointments = () => {
  const navigate = useNavigate();
  const {
    dToken,
    newAppointments,
    getNewAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getNewAppointments();
    console.log(newAppointments);
  }, [dToken]);
  if (!newAppointments || newAppointments.length === 0) {
    if (newAppointments.length === 0) {
      return (
        <div className="flex justify-center items-center h-screen w-full">
          <h1 className="text-2xl font-bold text-gray-500 italic">
            No Appointments
          </h1>
        </div>
      );
    }
    return <Loading />;
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">
              Manage upcoming patient sessions
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <span className="text-gray-600">Total Appointments</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {newAppointments.length}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newAppointments.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0d948833] p-2 rounded-lg">
                      <FiUser className="w-6 h-6 text-[#0d9f92]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.userData.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {calculateAge(item.userData.dob)} years
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.cancelled
                        ? "bg-red-100 text-red-700"
                        : item.isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-[#0d948833] text-blue-700"
                    }`}
                  >
                    {item.cancelled
                      ? "Cancelled"
                      : item.isCompleted
                      ? "Completed"
                      : "Upcoming"}
                  </span>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Appointment Date</p>
                    <p className="font-medium text-gray-900">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="font-medium text-gray-900">{item.slotTime}</p>
                  </div>
                </div>

                <div className="mt-5">
                  {!item.cancelled ? (
                    <div className="flex justify-around items-center border-t  border-gray-100 pt-5 px-5 flex-wrap gap-3">
                      <button
                        onClick={() => completeAppointment(item.id)}
                        className="flex justify-center w-auto items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <FiCheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-sm md:text-base">Complete</span>
                      </button>
                      <button
                        onClick={() => cancelAppointment(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FiXCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-sm md:text-base">Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {item.isCompleted
                        ? "Session completed"
                        : "Appointment cancelled"}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-end">
                {item.isRecord ? (
                  <button
                    className="flex items-center gap-2 text-[#0d9f92] hover:text-blue-700"
                    onClick={() =>
                      navigate(`/doctor/patientrecord_doctor/${item.recordId}`)
                    }
                  >
                    <FaFileMedical className="w-5 h-5" />
                    <span className="font-medium">Record</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 text-[#0d9f92] hover:text-blue-700"
                    onClick={() =>
                      navigate(
                        `/doctor/addnewpatientrecord/${item.userData.id}`
                      )
                    }
                  >
                    <BsFileEarmarkPlus className="w-5 h-5" />
                    <span className="font-medium">Add Record</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
