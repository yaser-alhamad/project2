import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <header className="relative flex flex-col md:flex-row flex-wrap bg-gradient-to-tr from-cyan-500 via-blue-500 to-blue-300 rounded-3xl px-8 md:px-16 py-6 md:py-10 overflow-hidden shadow-lg">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none z-0" />
            {/* --------- Header Left --------- */}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-4 md:py-0 z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-blue-900 font-extrabold leading-tight mb-4 drop-shadow-lg">
                    Book Appointment <br />  With Trusted Doctors
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 text-blue-900 text-base font-light mb-2">
                    <img className="w-32" src={assets.group_profiles} alt="Group of doctors" />
                    <p>Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block" /> schedule your appointment hassle-free.</p>
                </div>
                <button type="button" onClick={() => document.getElementById('speciality').scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-10 py-4 rounded-full text-white text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-blue-700">
                    Book appointment <img className="w-4" src={assets.arrow_icon} alt="Arrow icon" />
                </button>
            </div>
            {/* --------- Header Right --------- */}
            <div className="md:w-1/2 relative flex items-center justify-center z-10">
                <img className="w-full max-w-md md:absolute bottom-0 h-auto rounded-2xl shadow-2xl animate-float" src={assets.header_img} alt="Doctor illustration" />
            </div>
        </header>
    )
}

export default Header
// Add the following to your global CSS (e.g., index.css or tailwind.config.js):
// .animate-float { animation: float 6s ease-in-out infinite; }
// @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }

