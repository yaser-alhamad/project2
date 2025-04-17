import  { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Patients = () => {
  const navigate = useNavigate()
  const { aToken, allpatients, getAllPatientsRecord } = useContext(AdminContext)
  const {  calculateAge } = useContext(AppContext)
  
  useEffect(() => {
    if (aToken) {
      getAllPatientsRecord();
    }
   
      
  }, [aToken ]);

  return (

    <div className="w-full max-w-7xl mx-auto my-8 px-4 sm:my-12">
    <div className="bg-gradient-to-br from-sky-50 to-indigo-50 shadow-xl rounded-2xl border border-sky-100 p-6 sm:p-8">
      <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-center text-sky-900 drop-shadow-sm">
        Patient Records
        <span className="block mt-2 w-20 h-1 bg-sky-200 rounded-full mx-auto" />
      </h1>
  
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
        {/* Sticky Table Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[minmax(60px,0.5fr)_3fr_repeat(5,minmax(80px,1fr))] items-center py-4 px-4 sm:px-6 bg-sky-50/95 backdrop-blur text-sky-800 text-sm font-semibold uppercase tracking-wide border-b border-sky-200">
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Gender</span>
          <span>Visits</span>
          <span>Doctor</span>
          <span>Speciality</span>
        </div>
    
        {/* Table Body */}
        <div className="relative max-h-[70vh] overflow-y-auto">
          
          { allpatients.map((item, index) => (
            <div
              key={index}
              className="group border-b border-sky-50 hover:bg-sky-100 hover:cursor-pointer active:bg-sky-200 transition-colors duration-200 "
            >
              {/* Desktop View */}
              <div className="hidden sm:grid grid-cols-[minmax(60px,0.5fr)_3fr_repeat(5,minmax(80px,1fr))] items-center px-4 sm:px-6 py-3.5 text-gray-700 hover:bg-sky-100 active:bg-sky-200 transition-colors duration-200"
              onClick={() => navigate(`/admin/patientrecord_admin/${item.id}`)}
              >
                <span className="font-medium text-sky-600">{index + 1}</span>
                <span className="font-medium text-gray-900 truncate">{item.name}</span>
                <span>{calculateAge(item.date_of_birth)}</span>
                <span className="capitalize">{item.gender}</span>
                <span className="font-medium text-sky-600">{item.visits}</span>
                <span className="truncate">Dr. {item.doctorInfo.name}</span>
                <span className="text-sm text-gray-600 truncate">{item.doctorInfo.speciality}</span>
              </div>
  
              {/* Mobile View */}
              <div className="sm:hidden flex flex-col p-4 space-y-2.5 hover:bg-sky-100 active:bg-sky-200 transition-colors duration-200"
              onClick={() => navigate(`/admin/patientrecord/${item.id}`)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sky-600">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Age <span className="ml-2 text-gray-700">{calculateAge(item.date_of_birth)}</span></p>
                    <p className="text-gray-500">Visits <span className="ml-2 font-medium text-sky-600">{item.visits}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Gender <span className="ml-2 capitalize text-gray-700">{item.gender}</span></p>
                    <p className="text-gray-500">Doctor <span className="ml-2 text-gray-700 truncate">Dr. {item.doctorInfo.name}</span></p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1.5">
                  Speciality: <span className="ml-2 text-gray-700">{item.doctorInfo.speciality}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Patients;