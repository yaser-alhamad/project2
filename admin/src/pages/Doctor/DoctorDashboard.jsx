import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/Loading";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  if (!dashData || !dashData.appointment) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Medical Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back,{" "}
            <span className="text-teal-600 font-medium">
              Dr. {dashData.name}
            </span>
          </p>
        </div>
        <div className="text-sm bg-teal-50 text-teal-700 px-4 py-2 rounded-lg">
          <span className="font-medium">Last login:</span> Today at{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-teal-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {currency} {dashData.earnings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed Appointments</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {dashData.appointment.filter((item) => item.isCompleted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {dashData.appointment.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Patients</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {dashData.patients}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Patient Appointments
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              All scheduled appointments
            </p>
          </div>
          <div>
            <button className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors">
              New Appointment
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-gray-600 font-medium text-sm uppercase">
                  Patient
                </th>
                <th className="text-left py-3 px-6 text-gray-600 font-medium text-sm uppercase">
                  Contact
                </th>
                <th className="text-left py-3 px-6 text-gray-600 font-medium text-sm uppercase">
                  Appointment
                </th>
                <th className="text-left py-3 px-6 text-gray-600 font-medium text-sm uppercase">
                  Payment
                </th>
                <th className="text-left py-3 px-6 text-gray-600 font-medium text-sm uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashData.appointment.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {/* Patient Info */}
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3" />
                      {item.patientInfo?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.patientInfo?.dob
                        ? `${calculateAge(item.patientInfo.dob)} yrs`
                        : "N/A"}{" "}
                      | {item.patientInfo?.gender || "N/A"}
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {item.userData?.email || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.userData?.phone || "N/A"}
                    </div>
                  </td>

                  {/* Appointment Info */}
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {slotDateFormat(item.slotDate)}
                    </div>
                    <div className="text-sm text-gray-600">{item.slotTime}</div>
                  </td>

                  {/* Payment */}
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {item.payment ? "Online" : "Cash"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currency}
                      {item.amount}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.cancelled
                          ? "bg-red-100 text-red-700"
                          : item.isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {item.cancelled
                        ? "Cancelled"
                        : item.isCompleted
                        ? "Completed"
                        : "Upcoming"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {dashData.appointment.length} appointments
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100 text-gray-800 font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
