import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState([])
    const [allSlots, setAllSlots] = useState([])

    const [profileData, setProfileData] = useState(false)
    const [drPatientsRecord, setDrPatientsRecord] = useState([])
    const [patientRecord, setPatientRecord] = useState([])
    const [newAppointments, setNewAppointments] = useState([])

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {
            
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })

            if (data.success) {
               
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getNewAppointments = async () => {
        try {
            
            const { data } = await axios.get(backendUrl + '/api/doctor/new-appointments', { headers: { dToken } })

            if (data.success) {
               
                setNewAppointments(data.newAppointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getPatientRecord = async (id) => {
        try {
            if(id==="null"){
                toast.error("No record found")
                return
            }
            else{
                const { data } = await axios.get(backendUrl + `/api/doctor/patient-record/${id}`, { headers: { dToken } })
                if (data.success) {
                    setPatientRecord(data.patientRecord)
            } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const getPatientsRecordByDoctor = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/patients-record', { headers: { dToken } })
           
            setDrPatientsRecord(data.patientsData)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    //add patient record
    const addPatientRecord = async () => {
        try {
          
            const { data } = await axios.post(backendUrl + '/api/doctor/add-patient-record', {a:1}, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })
            console.log(appointmentId)
            if (data.success) {
                toast.success(data.message)
                getNewAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getNewAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {
          
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
            
            if (data.success) {
                setDashData(data.Data)
               
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }
  
    const changeSlotAvailability =async (slotId,slotDayId)=>{
       
        try{
            const {data} =await axios.post(backendUrl+'/api/doctor/change-slot-availability',{slotId,slotDayId},{headers:{dToken}})
           
            if(data.success){
                toast.success(data.message)
               
            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.log(error)
        }
    }
    const fetchActiveSlots=async()=>{
        try {
            const response = await axios.get(backendUrl+'/api/doctor/get-slots/',{ headers: { dToken } })
            if (response.data.success) {
                setAllSlots(response.data.slotsData || [])
            }
           
           
        } catch (error) {
            console.error("Error fetching active slots:", error)

        }
    }

    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
        addPatientRecord,
        getPatientsRecordByDoctor,
        drPatientsRecord,
        getPatientRecord,
        patientRecord,
        newAppointments,
        getNewAppointments,
        changeSlotAvailability,
        allSlots,
        setAllSlots,
        fetchActiveSlots
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
}

export default DoctorContextProvider; 