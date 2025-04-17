import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'
const Patients = () => {
  const navigate = useNavigate()
  const { dToken, getPatientsRecordByDoctor, drPatientsRecord } = useContext(DoctorContext)
  const { calculateAge } = useContext(AppContext)

  // Formats the last visit date or returns "N/A" if none is provided
  const formatLastVisitDate = (date) => {
    if (!date) return 'N/A'
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(date).toLocaleDateString('en-CA', options)
  }

  useEffect(() => {
    if (dToken) {
      getPatientsRecordByDoctor()
    }
  }, [dToken, getPatientsRecordByDoctor])
  if (!drPatientsRecord || drPatientsRecord.length === 0) {
    return <Loading />
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
            <p className="text-gray-600 mt-2">Manage and review patient details</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <span className="text-gray-600">Total Patients</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{drPatientsRecord.length}</div>
            </div>
          </div>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drPatientsRecord.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/doctor/patientrecord_doctor/${item.id}`)}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">Age: {calculateAge(item.date_of_birth)}</p>
                <p className="text-sm text-gray-600 capitalize">Gender: {item.gender}</p>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Visits:</span>
                  <span className="font-medium text-gray-900">{item.visits}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-600">Last Visit:</span>
                  <span className="font-medium text-gray-900">{formatLastVisitDate(item.last_visit)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Patients
