import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState([])
    const [allpatients, setAllPatients] = useState([])
    const [patientRecord, setPatientRecord] = useState([])
    const [recentActivities, setRecentActivities] = useState([])
    const [performanceData, setPerformanceData] = useState([])
    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
                
                // Extract performance data from doctors
                const doctorPerformance = data.doctors
                    .map(doctor => ({
                        name: doctor.name || "Unknown Doctor",
                        appointments: doctor.PerformanceData?.total_appointments || 0,
                        revenue: doctor.PerformanceData?.total_revenue || 0,
                        completionRate: doctor.PerformanceData?.completion_rate || 0,
                        patientCount: doctor.PerformanceData?.patient_count || 0,
                    }))
                    .sort((a, b) => b.appointments - a.appointments);
                
                // Take top performers
                const topDoctors = doctorPerformance.slice(0, 4);
                setPerformanceData({ doctorPerformance: topDoctors });
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting all patients data from Database using API    
    const getAllPatientsRecord = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-patients-record', { headers: { aToken } })
            if (data.success) {
                setAllPatients(data.patientsData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
    }   
    }
    // Function to get patient record using API
    const getPatientRecord = async (id) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/admin/patient-record/${id}`, { headers: { aToken } })
            if (data.success) {
                setPatientRecord(data.patientRecord)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Function to edit patient record using API
    const editPatientRecord = async (id, patientData) => {
        try {
            const { data } = await axios.put(backendUrl + `/api/admin/edit-patient-record/${id}`, patientData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Get recent activities from Database
    const getRecentActivities = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/recent-activities', { headers: { aToken } })
            
            if (data.success) {
                setRecentActivities(data.activities)
           
            } else {
                toast.error(data.message)
              
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
         
        }
    }

    // Log a new activity
    const logActivity = async (type, message) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/log-activity', 
                { type, message }, 
                { headers: { aToken } }
            )
            
            if (data.success) {
                getRecentActivities() // Refresh activities
            }
        } catch (error) {
            console.log(error)
        }
    }
    const changeSlotAvailability =async (slotId,slotDayId)=>{
        try{
            const {data} =await axios.post(backendUrl+'/api/admin/change-slot-availability',{slotId,slotDayId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.log(error)
        }
    }



    // Load data when component mounts or aToken changes
    useEffect(() => {
        if (aToken) {
            getAllDoctors();
            getDashData();
            getRecentActivities();
        }
    }, [aToken]);

    const value = {
        aToken, setAToken,backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        getAllPatientsRecord,
        allpatients,
        getPatientRecord,
        patientRecord,
        editPatientRecord,
        recentActivities,
        getRecentActivities,
        logActivity,
        performanceData,
        changeSlotAvailability,
      
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

AdminContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminContextProvider