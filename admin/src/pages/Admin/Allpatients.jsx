import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { FaHospital } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

const Patients = () => {
  const navigate = useNavigate();
  const { aToken, allpatients, getAllPatientsRecord } =
    useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllPatientsRecord();
    }
  }, [aToken]);

  // Helper function to get initials
  const getNameInitial = (name) => {
    if (!name) return "P";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[1]) {
      return nameParts[1][0] || "P";
    }
    return nameParts[0][0] || "P";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 bg-gray-50">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-[#0d9488]">
              Patient Records
            </h1>
            <p className="text-[#0d9f92] mt-1 font-medium">
              Manage patient information
            </p>
          </div>
          <div className="flex gap-3"></div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-teal-50 to-[#0d948833]">
            <h2 className="text-xl font-bold text-[#0d9488] flex items-center">
              <FiUsers className="mr-2 text-[#0d9f92]" />
              Registered Patients
            </h2>
            <span className="text-xs font-medium text-[#0d9f92] bg-teal-50/80 px-3 py-1 rounded-full">
              {allpatients.length} Total
            </span>
          </div>

          {/* Desktop View Header */}
          <div className="hidden sm:grid grid-cols-[minmax(60px,0.5fr)_3fr_repeat(5,minmax(80px,1fr))] items-center py-4 px-6 bg-gradient-to-r from-teal-50 to-[#0d948833] backdrop-blur text-[#0d9488] text-sm font-semibold uppercase tracking-wide border-b border-teal-100">
            <span>#</span>
            <span>Patient</span>
            <span>Age</span>
            <span>Gender</span>
            <span>Visits</span>
            <span>Doctor</span>
            <span>Speciality</span>
          </div>

          {/* Table Body */}
          <div className="relative max-h-[70vh] overflow-y-auto">
            {allpatients.map((item, index) => (
              <div
                key={index}
                className="group border-b border-gray-100 hover:bg-teal-50/30 transition-colors duration-200"
              >
                {/* Desktop View */}
                <div
                  className="hidden sm:grid grid-cols-[minmax(60px,0.5fr)_3fr_repeat(5,minmax(80px,1fr))] items-center px-6 py-4 text-gray-700 cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/patientrecord_admin/${item.id}`)
                  }
                >
                  <span className="font-medium text-[#0d9f92]">
                    {index + 1}
                  </span>

                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-full border-2 border-teal-100 object-cover shadow-sm"
                        onError={(e) =>
                          (e.target.src = "/placeholder-user.jpg")
                        }
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0d948833] flex items-center justify-center text-[#0d9488] font-bold">
                        {getNameInitial(item.name)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                  </div>

                  <span>{calculateAge(item.date_of_birth)}</span>
                  <span className="capitalize px-2 py-1 bg-teal-50 text-[#0d9488] text-xs w-fit font-medium rounded-full">
                    {item.gender}
                  </span>
                  <span className="font-medium text-[#0d9488]">
                    {item.visits}
                  </span>
                  <span className="truncate">Dr. {item.doctorInfo.name}</span>
                  <span className="text-sm font-medium px-2 py-1 bg-teal-50 w-fit text-teal-700 rounded-lg truncate">
                    {item.doctorInfo.speciality}
                  </span>
                </div>

                {/* Mobile View */}
                <div
                  className="sm:hidden flex items-center p-3 border-b border-gray-100 cursor-pointer"
                  onClick={() => navigate(`/admin/patientrecord/${item.id}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0d948833] flex items-center justify-center text-[#0d9488] font-bold text-xs mr-3">
                    {getNameInitial(item.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <span className="ml-2 text-xs text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded-full capitalize">
                        {item.gender}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">
                        Age: {calculateAge(item.date_of_birth)}
                      </span>
                      <span className="mr-2">•</span>
                      <span className="mr-2">
                        Visits:{" "}
                        <span className="text-[#0d9f92] font-medium">
                          {item.visits}
                        </span>
                      </span>
                      <span className="mr-2">•</span>
                      <span className="truncate">
                        Dr. {item.doctorInfo.name}
                      </span>
                    </div>
                  </div>

                  <div className="ml-2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            {allpatients.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <FaHospital className="w-12 h-12 mx-auto text-teal-200 mb-4" />
                <p className="text-lg font-medium text-[#0d9488]">
                  No patients found
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Patient records will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
