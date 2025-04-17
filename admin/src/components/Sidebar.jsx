import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'



const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  return (
    
    <div className='sticky top-0 left-0 h-full'>
     
      <div className='sidebar min-h-screen bg-white border-r hidden md:block overflow-hidden'>
        
        {aToken && <ul className='text-[#515151] mt-5'>

          <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>
          <NavLink to={'/allpatients'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Patients Record</p>
          </NavLink>
        </ul>}

        {dToken && <ul className='text-[#515151] mt-5'>
          <NavLink to={'/doctor/new-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>New Appointments</p>
          </NavLink>
          <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          
          <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.profile_icon} alt='' />

            <p className='hidden md:block'>Profile</p>
          </NavLink>
          <NavLink to={'/doctor/patients'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Patients</p>
          </NavLink>
          
        </ul>}
      </div>
    </div>
  )
}

export default Sidebar