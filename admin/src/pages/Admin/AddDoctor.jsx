import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-6 text-2xl font-semibold text-gray-800'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded-lg shadow-sm w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-6 mb-8'>
                    <label htmlFor="doc-img" className='cursor-pointer'>
                        <div className='relative group'>
                            <img 
                                className='w-24 h-24 object-cover rounded-full border-2 border-gray-200 group-hover:border-primary transition-all duration-300' 
                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                alt="Doctor" 
                            />
                            <div className='absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                <span className='text-white text-sm'>Change Photo</span>
                            </div>
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p className='text-gray-600'>Upload doctor picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-8'>
                    <div className='w-full lg:flex-1 flex flex-col gap-6'>
                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Your name</label>
                            <input 
                                onChange={e => setName(e.target.value)} 
                                value={name} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="text" 
                                placeholder='Enter doctor name' 
                                required 
                            />
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Doctor Email</label>
                            <input 
                                onChange={e => setEmail(e.target.value)} 
                                value={email} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="email" 
                                placeholder='Enter email address' 
                                required 
                            />
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Set Password</label>
                            <input 
                                onChange={e => setPassword(e.target.value)} 
                                value={password} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="password" 
                                placeholder='Enter password' 
                                required 
                            />
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Experience</label>
                            <select 
                                onChange={e => setExperience(e.target.value)} 
                                value={experience} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 appearance-none bg-white'
                            >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Fees</label>
                            <input 
                                onChange={e => setFees(e.target.value)} 
                                value={fees} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="number" 
                                placeholder='Enter consultation fees' 
                                required 
                            />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-6'>
                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Speciality</label>
                            <select 
                                onChange={e => setSpeciality(e.target.value)} 
                                value={speciality} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300  bg-white'
                            >
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Degree</label>
                            <input 
                                onChange={e => setDegree(e.target.value)} 
                                value={degree} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="text" 
                                placeholder='Enter doctor degree' 
                                required 
                            />
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Address</label>
                            <input 
                                onChange={e => setAddress1(e.target.value)} 
                                value={address1} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="text" 
                                placeholder='Address line 1' 
                                required 
                            />
                            <input 
                                onChange={e => setAddress2(e.target.value)} 
                                value={address2} 
                                className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                                type="text" 
                                placeholder='Address line 2' 
                                required 
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <label className='text-gray-700 font-medium block mb-2'>About Doctor</label>
                    <textarea 
                        onChange={e => setAbout(e.target.value)} 
                        value={about} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                        rows={5} 
                        placeholder='Write about the doctor...'
                    ></textarea>
                </div>

                <button 
                    type='submit' 
                    className='bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 mt-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                >
                    Add doctor
                </button>
            </div>
        </form>
    )
}

export default AddDoctor