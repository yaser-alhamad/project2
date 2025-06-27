import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { FiCalendar, FiDollarSign, FiSettings, FiPieChart } from 'react-icons/fi'
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaHeartbeat, FaStethoscope, FaNotesMedical } from 'react-icons/fa'
import Loading from '../../components/Loading'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData, getRecentActivities, recentActivities, performanceData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    if (aToken) {
      getDashData()
      getRecentActivities()
      setIsLoading(false)
    }
  }, [aToken])

  // Helper function to get initials
  const getNameInitial = (name) => {
    if (!name) return "D";
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[1]) {
      return nameParts[1][0] || "D";
    }
    return nameParts[0][0] || "D";
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 bg-gray-50">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Medical Dashboard</h1>
            <p className="text-blue-600 mt-1 font-medium">Welcome to HealthCare Hub</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <FiPieChart className="inline" /> 
              <span>Analytics</span>
            </button>
           
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-all'>
            <div className='p-3 bg-blue-100 text-blue-600 rounded-xl'>
              <FaUserMd className='w-6 h-6' />
            </div>
            <div>
              <p className='text-sm text-blue-600 font-medium'>Doctors</p>
              <p className='text-2xl font-bold text-gray-800'>{dashData.doctors || 0}</p>
              <p className='text-xs text-gray-500'>Active on platform</p>
            </div>
          </div>
          <div className='flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-green-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-all'>
            <div className='p-3 bg-green-100 text-green-600 rounded-xl'>
              <FaUserInjured className='w-6 h-6' />
            </div>
            <div>
              <p className='text-sm text-green-600 font-medium'>Patients</p>
              <p className='text-2xl font-bold text-gray-800'>{dashData.patients || 0}</p>
              <p className='text-xs text-gray-500'>Registered users</p>
            </div>
          </div>
          <div className='flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-all'>
            <div className='p-3 bg-indigo-100 text-indigo-600 rounded-xl'>
              <FaCalendarCheck className='w-6 h-6' />
            </div>
            <div>
              <p className='text-sm text-indigo-600 font-medium'>Consultations</p>
              <p className='text-2xl font-bold text-gray-800'>{dashData.appointments || 0}</p>
              <p className='text-xs text-gray-500'>Total appointments</p>
            </div>
          </div>
          <div className='flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-teal-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-all'>
            <div className='p-3 bg-teal-100 text-teal-600 rounded-xl'>
              <FiDollarSign className='w-6 h-6' />
            </div>
            <div>
              <p className='text-sm text-teal-600 font-medium'>Revenue</p>
              <p className='text-2xl font-bold text-gray-800'>${dashData.revenue || 0}</p>
              <p className='text-xs text-gray-500'>Total earnings</p>
            </div>
          </div>
        </div>

        {/* Middle Section - Doctor Performance and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Performance */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
              <FaStethoscope className="mr-2 text-blue-600" />
              Top Performing Doctors
            </h2>
            <div className="space-y-4">
              {performanceData?.doctorPerformance?.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-xl border border-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-inner">
                      {getNameInitial(doctor.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{doctor.name || "Unknown Doctor"}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {doctor.patientCount || 0} Patients
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {doctor.completionRate || 0}% efficacy
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-800">${doctor.revenue || 0}</p>
                    <p className="text-xs text-gray-500">{doctor.appointments || 0} consultations</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="w-full mt-6 py-2.5 text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              onClick={() => navigate('/doctor-list')}
            >
              View All Doctors
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-800 flex items-center">
                <FaHeartbeat className="mr-2 text-blue-600" />
                Clinical Activity Log
              </h2>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Real-time</span>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-teal-300"></div>
                <ul className="space-y-6">
                  {recentActivities && recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <li key={index} className="relative pl-10">
                        <div className={`absolute left-3 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'New Doctor' ? 'bg-blue-600 text-white' :
                          activity.type === 'Appointment' ? 'bg-green-600 text-white' :
                          activity.type === 'System' ? 'bg-purple-600 text-white' :
                          activity.type === 'Revenue' ? 'bg-teal-600 text-white' :
                          'bg-gray-600 text-white'
                        } z-10 shadow-md`}>
                          {activity.type === 'New Doctor' && <FaUserMd className="w-4 h-4" />}
                          {activity.type === 'Appointment' && <FiCalendar className="w-4 h-4" />}
                          {activity.type === 'System' && <FiSettings className="w-4 h-4" />}
                          {activity.type === 'Revenue' && <FiDollarSign className="w-4 h-4" />}
                          {activity.type === 'Patient' && <FaUserInjured className="w-4 h-4" />}
                        </div>
                        <p className="font-medium text-gray-800">{activity.message}</p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">{activity.time}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-4">No recent activities</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Latest Appointments */}
        <div className="grid grid-cols-1 gap-6">
          {/* Latest Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-teal-50">
              <h2 className="text-xl font-bold text-blue-800 flex items-center">
                <FaNotesMedical className="mr-2 text-blue-600" />
                Recent Consultations
              </h2>
              <button 
                className="text-blue-600 text-sm font-medium bg-white px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                onClick={() => navigate('/all-appointments')}
              >
                View All
              </button>
            </div>
            <ul className="divide-y divide-gray-100">
              {dashData.latestAppointments?.slice(0, 5).map((item, index) => (
                <li key={index} className="px-6 py-5 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Doctor Info */}
                    <div className="flex items-center space-x-4 w-1/4">
                      <div className="relative">
                        <img className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" src={item.docData.image} alt={item.docData.name} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Dr. {item.docData.name}</div>
                        <div className="text-xs text-blue-600 font-medium">Doctor</div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex items-center space-x-4 w-1/4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {getNameInitial(item.userData.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.userData.name}</div>
                        <div className="text-xs text-green-600 font-medium">Patient</div>
                      </div>
                    </div>

                    {/* Appointment Date */}
                    <div className="flex items-center space-x-2 w-1/4">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FiCalendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-gray-900 text-sm font-medium">
                          {slotDateFormat(item.slotDate)}
                        </div>
                        <div className="text-xs text-gray-500">{item.slotTime}</div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="w-1/4 flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        item.cancelled 
                          ? 'bg-red-100 text-red-700' 
                          : item.isCompleted 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled'}
                      </span>
                      
                      {!item.cancelled && !item.isCompleted && (
                        <button 
                          onClick={() => cancelAppointment(item._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 px-3 py-1 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {(!dashData.latestAppointments || dashData.latestAppointments.length === 0) && (
              <div className="py-8 text-center text-gray-500">No consultations found</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800 flex items-center">
              <FiSettings className="mr-2 text-blue-600" />
              Quick Actions
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Administrative Tools</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all">
              <FaUserMd className="w-8 h-8 text-blue-600 mb-3" />
              <span className="text-gray-800 font-medium">Add New Doctor</span>
              <span className="text-xs text-blue-600 mt-1">Register medical staff</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl hover:shadow-md transition-all">
              <FaNotesMedical className="w-8 h-8 text-teal-600 mb-3" />
              <span className="text-gray-800 font-medium">Create Report</span>
              <span className="text-xs text-teal-600 mt-1">Generate analytics</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:shadow-md transition-all">
              <FaCalendarCheck className="w-8 h-8 text-indigo-600 mb-3" />
              <span className="text-gray-800 font-medium">Schedule Appointment</span>
              <span className="text-xs text-indigo-600 mt-1">Book new consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard