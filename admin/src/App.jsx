import React, { useContext, useState } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import Allpatients from './pages/Admin/Allpatients';
import PatientRecord from './pages/Admin/PatientRecord_Admin';
import Patients from './pages/Doctor/Patients';
import PatientRecord_Doctor from './pages/Doctor/PatientRecord_Doctor';
import NewAppointments from './pages/Doctor/NweAppintents';
import { AppContext } from './context/AppContext';
import AddNewPatientRecord from './pages/Doctor/AddNewPatientRecord';
const App = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const { isSidebarVisible, toggleSidebar } = useContext(AppContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='flex items-start'>
        
          <Sidebar isSidebarVisible={isSidebarVisible}className='fixed top-0 left-0 h-full' />
          
          <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/allpatients/' element={<Allpatients />} />
          <Route path='/admin/patientrecord_admin/:id' element={<PatientRecord />} />
          <Route path='/doctor/patients' element={<Patients />} />
          <Route path='/doctor/patientrecord_doctor/:id' element={<PatientRecord_Doctor />} />
          <Route path='/doctor/new-appointments' element={<NewAppointments />} />
          <Route path='/doctor/addnewpatientrecord/:id' element={<AddNewPatientRecord />} />
        </Routes>
        
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App