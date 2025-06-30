import { createContext, useState } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
      setSidebarVisible(!isSidebarVisible);
    };
    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        if (!slotDate || typeof slotDate !== 'string') {
            return 'Invalid Date';
        }
        const dateArray = slotDate.split('_');
        if (dateArray.length !== 3) {
            return 'Invalid Date';
        }
        return dateArray[0] + " " + months[Number(dateArray[1])-1] + " " + dateArray[2];
    }

    // Function to calculate the age eg. ( 20_01_2000 => 24 )
    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
        isSidebarVisible,
        toggleSidebar,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider