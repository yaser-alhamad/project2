import { useEffect, useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { FaNotesMedical, FaTimes } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    doctors,
    getAllDoctors,
    generateAppointments,
  } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
      getAllDoctors();
    }
  }, [aToken]);

  const handleGenerateAppointments = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    const success = await generateAppointments(selectedDoctor);
    if (success) {
      setShowModal(false);
      setSelectedDoctor("");
    }
    setLoading(false);
  };

  const getNameInitial = (name) => {
    if (!name) return "P";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[1]) {
      return nameParts[1][0] || "P";
    }
    return nameParts[0][0] || "P";
  };

  const exportData = () => {
    const csvContent =
      "Name,Slot Date,Slot Time,Doctor Name,Fees\n" +
      appointments
        .map(
          (appointment) =>
            `${appointment.userInfo?.name || ''},${appointment.slotDate},${appointment.slotTime},${appointment.doctorInfo?.name || ''},${appointment.amount}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointmentsData.csv";
    a.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Appointments</h1>
            <p className="text-gray-500 mt-1">
              Manage patient consultations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
              onClick={exportData}
            >
              <FaNotesMedical className="inline" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaNotesMedical className="mr-2 text-teal-600" />
              Patient Consultations
            </h2>
            <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {appointments.length} Total
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                          {getNameInitial(item.patientInfo?.name)}
                        </div>
                        <span className="font-medium text-gray-900">{item.patientInfo?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.patientInfo?.dob ? calculateAge(item.patientInfo.dob) : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{slotDateFormat(item.slotDate)}</div>
                      <div className="text-sm text-gray-500">{item.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {item.doctorInfo?.image ? (
                          <img
                            src={item.doctorInfo.image}
                            alt={item.doctorInfo.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                            {getNameInitial(item.doctorInfo?.name)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">Dr. {item.doctorInfo?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-teal-600">{currency}{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.cancelled ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                          Scheduled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setOpenDropdown(openDropdown === item._id ? null : item._id)} className="text-gray-400 hover:text-gray-600">
                        <FiInfo size={20} />
                      </button>
                      {openDropdown === item._id && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4 border border-gray-200">
                          <div className="font-semibold text-gray-800 mb-2">Patient Info</div>
                          {item.patientInfo ? (
                            <div className="space-y-1 text-xs text-gray-600">
                              <div><span className="font-medium">Name:</span> {item.patientInfo.name}</div>
                              <div><span className="font-medium">Gender:</span> {item.patientInfo.gender || 'N/A'}</div>
                              <div><span className="font-medium">DOB:</span> {item.patientInfo.dob || 'N/A'}</div>
                            </div>
                          ) : <div className="italic text-gray-400 text-xs">No patient details.</div>}
                          <div className="font-semibold text-gray-800 mt-4 mb-2">Booked By</div>
                          {item.userInfo ? (
                            <div className="space-y-1 text-xs text-gray-600">
                              <div><span className="font-medium">Name:</span> {item.userInfo.name}</div>
                              <div><span className="font-medium">Phone:</span> {item.userInfo.phone}</div>
                              <div><span className="font-medium">Address:</span> {item.userInfo.address?.line1 || ''} {item.userInfo.address?.line2 || ''}</div>
                            </div>
                          ) : <div className="italic text-gray-400 text-xs">No user details.</div>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <FaNotesMedical className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-700">No appointments found</p>
                <p className="text-sm text-gray-500 mt-2">Scheduled consultations will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6 transform transition-all">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Generate Appointment Slots</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div>
              <p className="text-gray-600 mb-4">
                This will generate slots from 9 AM to 5 PM for the next 7 days (excluding Fridays). Each appointment is 1 hour long.
              </p>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">-- Select a doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} ({doctor.speciality})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAppointments}
                disabled={!selectedDoctor || loading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Generating..." : "Generate Slots"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;