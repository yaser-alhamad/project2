import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-6 text-[#262626] md:mx-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Top Doctors to Book
      </h1>
      <p className="sm:w-1/2 text-center text-base text-gray-600 mb-4">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-5 px-2">
        {doctors.slice(0, 8).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="bg-white/90 border border-teal-100 rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center p-5"
            key={index}
          >
            <img
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-200 mb-4 group-hover:scale-105 transition-transform duration-300"
              src={item.image}
              alt=""
            />
            <div className="flex items-center gap-2 text-sm mb-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.available ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              <span
                className={`font-semibold ${
                  item.available ? "text-green-600" : "text-gray-500"
                }`}
              >
                {item.available ? "Available" : "Not Available"}
              </span>
            </div>
            <p className="text-teal-900 text-lg font-bold mb-1">{item.name}</p>
            <p className="text-teal-700 text-sm mb-2">{item.speciality}</p>
            <div className="flex gap-2 mt-auto">
              {item.rating && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                  ⭐ {item.rating}
                </span>
              )}
              {item.experience && (
                <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {item.experience} yrs exp
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-teal-700 hover:bg-teal-800 text-white px-12 py-3 rounded-full mt-10 shadow-lg text-lg font-semibold transition-all duration-300"
      >
        See All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
