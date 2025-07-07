import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);
  const [showAddpatient, setShowAddpatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    gender: "",
    dob: "",
  });

  const handleAddpatient = (e) => {
    e.preventDefault();
    const { name, gender, dob } = newPatient;

    if (!name || !gender || !dob) {
      toast.error("Please fill in all fields before adding a medication.");
      return;
    }

    addNewPatient(newPatient);
    // Reset the new medication form
  };
  const addNewPatient = async (newPatient) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-Patient",
        { newPatient },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        setNewPatient({ name: "", gender: "", dob: "" });
        setShowAddpatient(false);
        await loadUserProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="max-w-4xl mx-auto p-5">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100 relative">
        {/* Edit Profile Button at Top Right */}
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="absolute top-4 right-4 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm font-semibold shadow-sm z-10"
          >
            Edit Profile
          </button>
        )}
        <div className="flex flex-col md:flex-row items-center p-8 gap-6">
          <div className="relative mb-4 md:mb-0 md:mr-8">
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer group">
                <div className="relative">
                  <img
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt="Profile"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <img
                      className="w-8 filter invert"
                      src={assets.upload_icon}
                      alt="Upload"
                    />
                  </div>
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
            ) : (
              <img
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                src={userData.image}
                alt="Profile"
              />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            {isEdit ? (
              <input
                className="w-full text-3xl font-bold mb-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {userData.name}
              </h1>
            )}
            <p className="text-gray-500 mt-1 text-lg">{userData.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
            Contact Information
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              {isEdit ? (
                <input
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-800 text-base">
                  {userData.phone || "Not provided"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    placeholder="Street address"
                  />
                  <input
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="text"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    placeholder="Apartment, suite, etc."
                  />
                </div>
              ) : (
                <p className="text-gray-800 text-base">
                  {userData.address.line1 || "No address provided"} <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
            Basic Information
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gender
              </label>
              {isEdit ? (
                <select
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option value="Not Selected">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-gray-800 text-base">
                  {userData.gender || "Not specified"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date of Birth
              </label>
              {isEdit ? (
                <input
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-800 text-base">
                  {userData.dob || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {isEdit && (
        <div className="mt-10 flex justify-end space-x-4">
          <button
            onClick={() => setIsEdit(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow"
          >
            Cancel
          </button>
          <button
            onClick={updateUserProfileData}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow"
          >
            Save Changes
          </button>
        </div>
      )}
      {/* Patients Section */}
      {userData.patients.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-7 mt-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Associated Patients
            </h2>
            <button
              onClick={() => setShowAddpatient(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow"
            >
              + Add Patient
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.patients.map((patient) => (
              <div
                key={patient._id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm relative"
              >
                <h3 className="font-medium text-gray-800 text-lg">
                  {patient.name}
                </h3>
                <div className="flex items-center mt-2 text-sm text-gray-600 gap-2">
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded">
                    {patient.gender}
                  </span>
                  <span>{patient.dob}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add Patient Modal */}
      {showAddpatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6 border border-gray-200 relative">
            <button
              onClick={() => setShowAddpatient(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Add Patient
            </h3>
            <form onSubmit={handleAddpatient} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Patient Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Patient dob{" "}
                </label>
                <input
                  type="date"
                  name="dob"
                  value={newPatient.dob}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddpatient(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default MyProfile;
