import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className='flex flex-col lg:flex-row gap-8 justify-center items-center'>
                <div className="lg:w-1/3 md:w-1/2 sm:w-1/2 w-1/3 flex justify-center items-center "> 
                    <div className="bg-white rounded-full shadow-sm overflow-hidden ">
                        <img 
                            className='w-full sm:h-auto object-cover rounded-full' 
                            src={profileData.image} 
                            alt="Doctor profile" 
                        />
                    </div>
                </div>

                <div className='lg:w-2/3 bg-white rounded-xl shadow-sm p-6 sm:p-8'>
                    {/* ----- Doc Info : name, degree, experience ----- */}
                    <div className="mb-6">
                        <h1 className='text-3xl font-semibold text-gray-800'>{profileData.name}</h1>
                        <div className='flex items-center gap-3 mt-2'>
                            <p className="text-gray-600">{profileData.degree} - {profileData.speciality}</p>
                            <span className='px-3 py-1 text-sm bg-primary/10 text-primary rounded-full'>
                                {profileData.experience} years experience
                            </span>
                        </div>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div className="mb-6">
                        <label className='block text-sm font-medium text-gray-700 mb-2'>About</label>
                        {
                            isEdit
                                ? <textarea 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                    className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none' 
                                    rows={6} 
                                    value={profileData.about} 
                                />
                                : <p className='text-gray-600'>{profileData.about}</p>
                        }
                    </div>

                    <div className="mb-6">
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Appointment Fee</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">{currency}</span>
                            {isEdit 
                                ? <input 
                                    type='number' 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                    value={profileData.fees}
                                    className="w-32 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                />
                                : <span className="text-gray-800 font-medium">{profileData.fees}</span>
                            }
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Address</label>
                        <div className="space-y-2">
                            {isEdit 
                                ? <>
                                    <input 
                                        type='text' 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                        value={profileData.address.line1}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                    <input 
                                        type='text' 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                        value={profileData.address.line2}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                </>
                                : <p className='text-gray-600'>
                                    {profileData.address.line1}<br />
                                    {profileData.address.line2}
                                </p>
                            }
                        </div>
                    </div>

                    <div className='flex items-center gap-2 mb-6'>
                        <label className="relative inline-flex items-center cursor-pointer">
                          {isEdit ?
                            <>
                            <input 
                                type="checkbox" 
                                onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                                checked={profileData.available}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </>
                            :
                              <div className={`${profileData.available ? 'bg-green-500' : 'bg-red-500'} w-6 h-6 rounded-full`}></div>
                            } 
                            <span className="ml-3 text-sm font-medium text-gray-700">Available for appointments</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        {
                            isEdit
                                ? <>
                                    <button 
                                        onClick={() => setIsEdit(false)} 
                                        className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200'
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={updateProfile} 
                                        className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md'
                                    >
                                        Save Changes
                                    </button>
                                </>
                                : <button 
                                    onClick={() => setIsEdit(prev => !prev)} 
                                    className='px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200'
                                >
                                    Edit Profile
                                </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile