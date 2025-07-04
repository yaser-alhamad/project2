import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [allSlots, setAllSlots] = useState([])
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token')
        return storedToken && storedToken.trim() !== '' ? storedToken : ''
    })
    const [userData, setUserData] = useState(false)



    
    useEffect(() => {
        // This effect is just a placeholder to show where you might handle server-down logic.
        // In your API calls, if you catch a network/server error, you should call:
        // localStorage.removeItem('token'); setToken('');
        // For example, in your catch blocks in API calls.
    }, [])

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }
    const fetchDoctoreSlots=async(docId)=>{
        try {
            const response = await axios.post(backendUrl+'/api/user/get-doctor-slots/',{docId},{ headers: { token } })
            if (response.data.success) {
                setAllSlots(response.data.slotsData || [])
               
            }
        } catch (error) {
            console.error("Error fetching active slots:", error)

        }
    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        fetchDoctoreSlots,allSlots
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider