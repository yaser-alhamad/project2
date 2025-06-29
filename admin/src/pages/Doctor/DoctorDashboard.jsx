import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

import { FiCalendar } from "react-icons/fi";
import Loading from "../../components/Loading";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDashData();
    console.log(dashData);
  }, [dToken]);
  if (!dashData || !dashData.appointment) {
    return <Loading />;
    // or any loading indicator you prefer
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back,Dr. {dashData.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img className="w-14" src={assets.earning_icon} alt="" />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {currency} {dashData.earnings}
                </p>
                <p className="text-gray-400">Earnings</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img className="w-14" src={assets.appointments_icon} alt="" />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {
                    dashData.appointment.filter((item) => item.isCompleted)
                      .length
                  }
                </p>
                <p className="text-gray-400">Appointments completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img className="w-14" src={assets.appointments_icon} alt="" />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {dashData.appointment.length}
                </p>
                <p className="text-gray-400">Appointments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img className="w-14" src={assets.patients_icon} alt="" />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {dashData.patients}
                </p>
                <p className="text-gray-400">Patients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <ul className="space-y-3">
          {dashData.appointment.map((item, index) => (
            <li
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between px-6 py-4">
                {/* Patient Info */}
                <div className="flex items-center space-x-4 w-1/4">
                  <div className="font-semibold text-gray-900">
                    {item.userData.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {calculateAge(item.userData.dob)} yrs
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.cancelled
                        ? "bg-red-100 text-red-700"
                        : item.isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-[#0d948833] text-[#0d9488]"
                    }`}
                  >
                    {item.cancelled
                      ? "Cancelled"
                      : item.isCompleted
                      ? "Completed"
                      : "Upcoming"}
                  </span>
                </div>

                {/* Appointment Date */}
                <div className="flex items-center space-x-2 w-1/4">
                  <FiCalendar className="w-5 h-5 text-gray-500" />
                  <div className="text-gray-900 text-sm flex flex-row gap-2">
                    <span>{slotDateFormat(item.slotDate)}</span>
                    <span>{item.slotTime}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className=" items-center space-x-2 w-1/4 md:block hidden">
                  <div className="flex items-center space-x-1 text-gray-900 font-medium">
                    <span>{item.payment ? "Online" : "Cash"}</span>
                    <span>•</span>
                    <span>
                      {currency}
                      {item.amount}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;
