import  { useContext, useEffect,useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { FiPlusSquare } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import { toast } from 'react-toastify'
import axios from 'axios'

import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    password: '',
    experience: '',
    fees: '',
    about: '',
    speciality: '',
    degree: '',
    address1: '',
    address2: ''
  })
  const [docImg, setDocImg] = useState(null)
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const { backendUrl } = useContext(AppContext)
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {

      if (!docImg) {
        return toast.error('Image Not Selected')
    }

    const formData = new FormData();

    formData.append('image', docImg)
    formData.append('name', doctorData.name)
    formData.append('email', doctorData.email)
    formData.append('password', doctorData.password)
    formData.append('experience', doctorData.experience)
    formData.append('fees', Number(doctorData.fees))
    formData.append('about', doctorData.about)
    formData.append('speciality', doctorData.speciality)
    formData.append('degree', doctorData.degree)
    formData.append('address', JSON.stringify({ line1: doctorData.address1, line2: doctorData.address2 }))

    const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
    if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setDoctorData({
          name: '',
          email: '',
          password: '',
          experience: '',
          fees: '',
          about: '',
          speciality: '',
          degree: '',
          address1: '',
          address2: ''
        })
        setShowAddDoctor(false)
    } else {
        toast.error(data.message)
    }
    } catch (error) {
      console.log(error)
    }
  }
  const handleAddDoctor = () => {
    setShowAddDoctor(true)
  }
  const handleCloseAddDoctor = () => {
    setShowAddDoctor(false)
    setDoctorData({
      name: '',
      email: '',
      password: '',
      experience: '',
      fees: '',
      about: '',
      speciality: '',
      degree: '',
      address1: '',
      address2: ''
    })
    setDocImg(null)
  }
  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
  }, [aToken])
  
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='flex flex-col gap-1 mt-2'>
                <span className='text-[#5C5C5C] text-sm font-medium '>Total Appointments: {item.PerformanceData?.total_appointments} </span>
                <span className='text-[#5C5C5C] text-sm font-medium  '>Total Revenue: ${item.PerformanceData?.total_revenue}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium"> {item.PerformanceData?.completion_rate}% efficacy </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium"> {item.PerformanceData?.patient_count} patients</span>
              
              </div>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}

        <div onClick={handleAddDoctor} className='border border-dashed border-[#C9D8FF] rounded-xl max-w-56 min-w-56 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EAEFFF] transition-all duration-300'>
          <FiPlusSquare className="text-4xl text-primary  mb-2 w-10 h-10" />
          
          <p className="text-primary font-medium">Add New Doctor</p>
        </div>
      </div>
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center ">
          <div className='bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl space-y-4'>
            <p className='mb-6 text-2xl font-semibold text-gray-800 flex text-end justify-end '> 
             <span className='text-red-500 cursor-pointer' onClick={handleCloseAddDoctor}>
              <AiOutlineClose className='text-2xl'  />
             </span>

              </p>
            <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      
            <span className='font-semibold text-2xl  text-center justify-center '>Add Doctor</span>
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
                             onChange={e => setDoctorData({...doctorData, name: e.target.value})} 
                             value={doctorData.name} 
                             className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                             type="text" 
                             placeholder='Enter doctor name' 
                             required 
                         />
                     </div>

                     <div className='flex-1 flex flex-col gap-2'>
                         <label className='text-gray-700 font-medium'>Doctor Email</label>
                         <input 
                             onChange={e => setDoctorData({...doctorData, email: e.target.value})} 
                             value={doctorData.email} 
                             className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                             type="email" 
                             placeholder='Enter email address' 
                             required 
                         />
                     </div>

                     <div className='flex-1 flex flex-col gap-2'>
                         <label className='text-gray-700 font-medium'>Set Password</label>
                         <input 
                             onChange={e => setDoctorData({...doctorData, password: e.target.value})} 
                             value={doctorData.password} 
                             className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                             type="password" 
                             placeholder='Enter password' 
                             required 
                         />
                     </div>

                     <div className='flex-1 flex flex-col gap-2'>
                         <label className='text-gray-700 font-medium'>Experience</label>
                         <select 
                             onChange={e => setDoctorData({...doctorData, experience: e.target.value})} 
                             value={doctorData.experience} 
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
                             onChange={e => setDoctorData({...doctorData, fees: e.target.value})} 
                             value={doctorData.fees} 
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
                             onChange={e => setDoctorData({...doctorData, speciality: e.target.value})} 
                             value={doctorData.speciality} 
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
                             onChange={e => setDoctorData({...doctorData, degree: e.target.value})} 
                             value={doctorData.degree} 
                             className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                             type="text" 
                             placeholder='Enter doctor degree' 
                             required 
                         />
                     </div>

                     <div className='flex-1 flex flex-col gap-2'>
                         <label className='text-gray-700 font-medium'>Address</label>
                         <input 
                             onChange={e => setDoctorData({...doctorData, address1: e.target.value})} 
                             value={doctorData.address1} 
                             className='border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300' 
                             type="text" 
                             placeholder='Address line 1' 
                             required 
                         />
                         <input 
                             onChange={e => setDoctorData({...doctorData, address2: e.target.value})} 
                             value={doctorData.address2} 
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
                     onChange={e => setDoctorData({...doctorData, about: e.target.value})} 
                     value={doctorData.about} 
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
         </div>
     </div>
      )}
    </div>
  )
}

export default DoctorsList