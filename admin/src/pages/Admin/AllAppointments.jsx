import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4 sm:my-12">
    <div className="bg-gradient-to-br from-sky-50 to-indigo-50 shadow-xl rounded-2xl border border-sky-100 p-6 sm:p-8">
      <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-center text-sky-900 drop-shadow-sm">
        All Appointments
        <span className="block mt-2 w-20 h-1 bg-sky-200 rounded-full mx-auto" />
      </h1>
  
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
        {/* Sticky Table Header */}
        <div className="sticky top-0 z-10 hidden sm:grid grid-cols-[minmax(40px,0.5fr)_3fr_minmax(60px,1fr)_3fr_3fr_minmax(100px,1fr)_100px] items-center py-4 px-6 bg-sky-50/95 backdrop-blur text-sky-800 text-sm font-semibold uppercase tracking-wide border-b border-sky-200">
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
              className="group border-b border-sky-50 hover:bg-white/50 transition-colors duration-200"
            >
              {/* Desktop View */}
              <div className="hidden sm:grid grid-cols-[minmax(40px,0.5fr)_3fr_minmax(60px,1fr)_3fr_3fr_minmax(100px,1fr)_100px] items-center px-6 py-3.5 text-gray-700">
                <span className="font-medium text-sky-600">{index + 1}</span>
                
                <div className="flex items-center gap-3 truncate">
                  <img 
                    src={item.userData.image} 
                    alt={item.userData.name} 
                    className="w-8 h-8 rounded-full border-2 border-sky-100 object-cover shadow-sm"
                    onError={(e) => e.target.src = '/placeholder-user.jpg'}
                  />
                  <span className="font-medium text-gray-900 truncate">{item.userData.name}</span>
                </div>
  
                <span>{calculateAge(item.userData.dob)}</span>
  
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{slotDateFormat(item.slotDate)}</span>
                  <span className="text-sm text-gray-500">{item.slotTime}</span>
                </div>
  
                <div className="flex items-center gap-3 truncate">
                  <img 
                    src={item.docData.image} 
                    alt={item.docData.name} 
                    className="w-8 h-8 rounded-full border-2 border-sky-100 object-cover shadow-sm"
                    onError={(e) => e.target.src = '/placeholder-doctor.jpg'}
                  />
                  <span className="font-medium text-gray-900 truncate">Dr. {item.docData.name}</span>
                </div>
  
                <span className="font-semibold text-sky-700">{currency}{item.amount}</span>
  
                <div className="flex justify-center">
                  {item.cancelled ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
                  ) : (
                    <button 
                      onClick={() => cancelAppointment(item._id)}
                      className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Cancel appointment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
  
              {/* Mobile View */}
              <div className="sm:hidden flex flex-col p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sky-600">#{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.cancelled ? 'bg-red-100 text-red-700' : 
                      item.isCompleted ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                </div>
  
                <div className="flex items-center gap-3">
                  <img 
                    src={item.userData.image} 
                    alt={item.userData.name} 
                    className="w-8 h-8 rounded-full border-2 border-sky-100 object-cover shadow-sm"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.userData.name}</p>
                    <p className="text-sm text-gray-500">Age {calculateAge(item.userData.dob)}</p>
                  </div>
                </div>
  
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Date</p>
                    <p className="text-gray-900">{slotDateFormat(item.slotDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Time</p>
                    <p className="text-gray-900">{item.slotTime}</p>
                  </div>
                </div>
  
                <div className="flex items-center gap-3">
                  <img 
                    src={item.docData.image} 
                    alt={item.docData.name} 
                    className="w-8 h-8 rounded-full border-2 border-sky-100 object-cover shadow-sm"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Dr. {item.docData.name}</p>
                    <p className="text-sm text-gray-500 truncate">{item.docData.speciality || 'General Physician'}</p>
                  </div>
                </div>
  
                <div className="flex justify-between items-center pt-2">
                  <p className="font-semibold text-sky-700">{currency}{item.amount}</p>
                  {!item.cancelled && !item.isCompleted && (
                    <button 
                      onClick={() => cancelAppointment(item._id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default AllAppointments