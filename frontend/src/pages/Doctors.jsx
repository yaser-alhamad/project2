import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100 py-6 px-2 md:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-900 mb-2">
          Find Your Doctor
        </h1>
        <p className="text-gray-600 mb-6">
          Browse through the doctors specialist.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`py-2 px-5 border rounded-lg text-base font-semibold shadow-md transition-all sm:hidden ${
              showFilter
                ? "bg-teal-700 text-white"
                : "bg-white/80 text-teal-700"
            }`}
          >
            Filters
          </button>
          <div
            className={`flex-col gap-4 text-base text-teal-900 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-4 mb-4 sm:mb-0 ${
              showFilter ? "flex" : "hidden sm:flex"
            }`}
          >
            {[
              "General physician",
              "Gynecologist",
              "Dermatologist",
              "Pediatricians",
              "Neurologist",
              "Gastroenterologist",
            ].map((spec) => (
              <p
                key={spec}
                onClick={() =>
                  speciality === spec
                    ? navigate("/doctors")
                    : navigate(`/doctors/${spec}`)
                }
                className={`w-full sm:w-auto pl-3 py-2 pr-10 border border-teal-200 rounded-xl transition-all cursor-pointer font-medium mb-1 hover:bg-teal-50 hover:text-teal-800 ${
                  speciality === spec
                    ? "bg-teal-100 text-teal-900 border-teal-400"
                    : ""
                }`}
              >
                {spec}
              </p>
            ))}
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filterDoc.map((item, index) => (
              <div
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="bg-white/80 backdrop-blur-md border border-teal-100 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center p-5"
                key={index}
              >
                <img
                  className="w-24 h-24 rounded-full object-cover border-4 border-teal-200 mb-4 group-hover:scale-105 transition-transform duration-300 bg-teal-100"
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
                <p className="text-teal-900 text-lg font-bold mb-1">
                  {item.name}
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default Doctors;
