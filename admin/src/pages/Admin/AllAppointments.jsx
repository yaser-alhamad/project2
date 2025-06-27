import { useEffect, useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { FaNotesMedical, FaCalendarPlus } from 'react-icons/fa'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, doctors, getAllDoctors, generateAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
      getAllDoctors()
    }
  }, [aToken])

  // Handle generating appointments
  const handleGenerateAppointments = async () => {
    if (!selectedDoctor) return
    setLoading(true)
    const success = await generateAppointments(selectedDoctor)
    if (success) {
      setShowModal(false)
      setSelectedDoctor("")
    }
    setLoading(false)
  }

  // Helper function to get initials
  const getNameInitial = (name) => {
    if (!name) return "P";
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[1]) {
      return nameParts[1][0] || "P";
    }
    return nameParts[0][0] || "P";
  };
  const exportData = () => {
    const csvContent = 'Name,Slot Date,Slot Time,Doctor Name,Fees\n' + appointments.map(appointment => `${appointment.userData.name},${appointment.slotDate},${appointment.slotTime},${appointment.docData.name},${appointment.amount}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointmentsData.csv';
    a.click();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 bg-gray-50">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">All Appointments</h1>
            <p className="text-blue-600 mt-1 font-medium">Manage patient consultations</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
              onClick={() => setShowModal(true)}
            >
              <FaCalendarPlus className="inline" /> 
              <span>Generate Slots</span>
            </button>
            <button 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              onClick={exportData}
            >
              <FaNotesMedical className="inline" /> 
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-teal-50">
            <h2 className="text-xl font-bold text-blue-800 flex items-center">
              <FaNotesMedical className="mr-2 text-blue-600" />
              Patient Consultations
            </h2>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {appointments.length} Total
            </span>
          </div>

          {/* Desktop View Header */}
          <div className="hidden sm:grid grid-cols-[minmax(40px,0.5fr)_3fr_minmax(60px,1fr)_3fr_3fr_minmax(100px,1fr)_100px] items-center py-4 px-6 bg-blue-50/80 backdrop-blur text-blue-800 text-sm font-semibold uppercase tracking-wide border-b border-blue-100">
            <span>#</span>
            <span>Patient</span>
            <span>Age</span>
            <span>Date & Time</span>
            <span>Doctor</span>
            <span>Fees</span>
            <span>Action</span>
          </div>

          {/* Table Body */}
          <div className="relative max-h-[70vh] overflow-y-auto">
            {appointments.map((item, index) => (
              <div
                key={item._id}
                className="group border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-200"
              >
                {/* Desktop View */}
                <div className="hidden sm:grid grid-cols-[minmax(40px,0.5fr)_3fr_minmax(60px,1fr)_3fr_3fr_minmax(100px,1fr)_100px] items-center px-6 py-4 text-gray-700">
                  <span className="font-medium text-blue-600">{index + 1}</span>
                  
                  <div className="flex items-center gap-3 truncate">
                    {item.userData.image ? (
                      <img 
                        src={item.userData.image} 
                        alt={item.userData.name} 
                        className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover shadow-sm"
                        onError={(e) => e.target.src = '/placeholder-user.jpg'}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {getNameInitial(item.userData.name)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900 truncate">{item.userData.name}</span>
                  </div>
  
                  <span>{calculateAge(item.userData.dob)}</span>
  
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{slotDateFormat(item.slotDate)}</span>
                    <span className="text-sm text-gray-500">{item.slotTime}</span>
                  </div>
  
                  <div className="flex items-center gap-3 truncate">
                    {item.docData.image ? (
                      <img 
                        src={item.docData.image} 
                        alt={item.docData.name} 
                        className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover shadow-sm"
                        onError={(e) => e.target.src = '/placeholder-doctor.jpg'}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-inner">
                        {getNameInitial(item.docData.name)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900 truncate">Dr. {item.docData.name}</span>
                  </div>
  
                  <span className="font-semibold text-blue-700">{currency}{item.amount}</span>
  
                  <div className="flex justify-center">
                    {item.cancelled ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">Completed</span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">Scheduled</span>
                    )}
                  </div>
                </div>
  
                {/* Mobile View */}
                <div className="sm:hidden flex items-center p-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-3">
                    {getNameInitial(item.userData.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-900 truncate">{item.userData.name}</p>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        item.cancelled ? 'bg-red-100 text-red-700' : 
                        item.isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">{slotDateFormat(item.slotDate)}</span>
                      <span className="mr-2">•</span>
                      <span className="mr-2">{item.slotTime}</span>
                      <span className="mr-2">•</span>
                      <span className="text-blue-600 font-medium">{currency}{item.amount}</span>
                      <span className="mr-2">•</span>
                      <span className="truncate">Dr. {item.docData.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {appointments.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <FaNotesMedical className="w-12 h-12 mx-auto text-blue-200 mb-4" />
                <p className="text-lg font-medium text-blue-800">No appointments found</p>
                <p className="text-sm text-gray-500 mt-2">All scheduled consultations will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-800">Generate Appointment Slots</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div>
              <p className="text-gray-600 mb-4">
                This will generate appointment slots from 9 AM to 5 PM for the next 7 days (excluding Fridays).
                Each appointment is 1 hour long.
              </p>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">-- Select a doctor --</option>
                  {doctors.map(doctor => (
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
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAppointments}
                disabled={!selectedDoctor || loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${!selectedDoctor || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {loading ? 'Generating...' : 'Generate Slots'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllAppointments