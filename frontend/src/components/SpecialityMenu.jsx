import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-8 text-[#262626]"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Find by Speciality
      </h1>
      <p className="sm:w-1/2 text-center text-base text-gray-600 mb-4">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-5 px-2">
        {specialityData.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center bg-white/90 border border-teal-100 rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl hover:bg-teal-50 transition-all duration-300 group"
            key={index}
          >
            <img
              className="w-16 sm:w-20 mb-3 group-hover:scale-110 transition-transform duration-300"
              src={item.image}
              alt=""
            />
            <p className="font-medium text-teal-800 text-sm md:text-base">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
