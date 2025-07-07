import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

import {
  UserCircleIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  BeakerIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  PencilAltIcon,
} from "@heroicons/react/solid";
import {
  SectionCard,
  VitalSign,
  InfoBox,
  InfoItem,
} from "../../components/Cards";
import { toast } from "react-toastify";
const PatientRecord_Admin = () => {
  const { id } = useParams();
  const { aToken, getPatientRecord, patientRecord, editPatientRecord } =
    useContext(AdminContext);

  // State for editing the patient overview
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  // State for editing the patient medications

  // State for form overview data
  const [formOverviewData, setFormOverviewData] = useState({
    name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
  });

  // State for new medication inputs

  useEffect(() => {
    if (aToken) {
      getPatientRecord(id);
    }
  }, [id]);

  useEffect(() => {
    // This useEffect is triggered whenever the patientRecord changes.
    // It updates the formOverviewData state with the current patient's information
    // when the edit overview modal is shown, ensuring that the form is populated
    // with the latest data for editing.
    if (showEditOverviewModal) {
      setFormOverviewData({
        name: patientRecord.name || "",
        gender: patientRecord.gender || "",
        date_of_birth: patientRecord.date_of_birth?.substring(0, 10) || "",
        phone: patientRecord.contact?.phone || "",
        addressLine1: patientRecord.contact?.address?.line1 || "",
        addressLine2: patientRecord.contact?.address?.line2 || "",
      });
    }
    // Additionally, when the edit medications modal is shown, it resets the newMedication state
    // to ensure that the form is clear for new input.
  }, [patientRecord]);

  const handleInputOverviewChange = (e) => {
    const { name, value } = e.target;
    setFormOverviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverviewSubmit = (e) => {
    e.preventDefault();
    if (
      formOverviewData.name === "" ||
      formOverviewData.gender === "" ||
      formOverviewData.date_of_birth === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const updatedData = {
      ...patientRecord,
      name: formOverviewData.name,
      gender: formOverviewData.gender,
      date_of_birth: new Date(formOverviewData.date_of_birth),
      contact: {
        ...patientRecord.contact,
        phone: formOverviewData.phone,
        address: {
          ...patientRecord.contact?.address,
          line1: formOverviewData.addressLine1,
          line2: formOverviewData.addressLine2,
        },
      },
    };
    editPatientRecord(id, updatedData);
    setShowEditOverviewModal(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-teal-50">
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
          <div className="flex items-center gap-3 mb-6">
            <UserCircleIcon className="w-8 h-8 text-[#0d9f92]" />
            <h2 className="text-2xl font-bold text-sky-900">
              Patient Overview
            </h2>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowEditOverviewModal(true)}
              className="flex items-center gap-1 text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
            >
              <PencilAltIcon className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
            <InfoItem label="Full Name" value={patientRecord?.name || "N/A"} />
            <InfoItem
              label="Date of Birth"
              value={
                patientRecord?.date_of_birth
                  ? new Date(patientRecord.date_of_birth).toLocaleDateString()
                  : "N/A"
              }
            />
            <InfoItem label="Gender" value={patientRecord?.gender || "N/A"} />
            <InfoItem
              label="Contact"
              value={patientRecord?.contact?.phone || "N/A"}
            />
            <div className="md:col-span-2">
              <InfoItem
                label="Address"
                value={`${patientRecord?.contact?.address?.line1 || ""}, ${
                  patientRecord?.contact?.address?.line2 || ""
                }`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            icon={<DocumentTextIcon className="w-6 h-6 text-green-600" />}
            title="Medical History"
          >
            <ul className="space-y-3">
              {patientRecord?.medical_history?.length > 0 ? (
                patientRecord.medical_history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-l-4 border-green-100 pl-3 "
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{item}</p>
                    </div>
                  </div>
                ))
              ) : (
                <li>No medical history available</li>
              )}
            </ul>
          </SectionCard>

          <SectionCard
            icon={<ClipboardCheckIcon className="w-6 h-6 text-purple-600" />}
            title="Active Medications"
          >
            <div className="space-y-3">
              {patientRecord?.medications?.length > 0 ? (
                patientRecord.medications.map((med) => (
                  <div
                    key={med._id}
                    className="flex items-center justify-between border-l-4 border-purple-100 pl-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{med.name}</p>
                      <p className="text-sm text-gray-500">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No medications available</p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />}
            title="Allergies"
          >
            <div className="flex flex-wrap gap-2">
              {patientRecord?.allergies?.length > 0 ? (
                patientRecord.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    <div className="flex items-center gap-2">{allergy}</div>
                  </span>
                ))
              ) : (
                <span>No allergies available</span>
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={<BeakerIcon className="w-6 h-6 text-teal-500" />}
            title="Immunizations"
          >
            <ul className="space-y-2">
              {patientRecord?.immunizations?.length > 0 ? (
                patientRecord.immunizations.map((imm, idx) => (
                  <div
                    key={imm._id}
                    className="flex  items-center justify-between border-l-4 border-teal-100 pl-3"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-gray-800">{imm.vaccine}</p>
                      <p className="text-sm text-gray-500">
                        Doses: {imm.doses} • Date:{" "}
                        {new Date(imm.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <li>No immunizations available</li>
              )}
            </ul>
          </SectionCard>
        </div>

        <SectionCard
          icon={<CalendarIcon className="w-6 h-6 text-orange-500" />}
          title="Recent Visit"
        >
          {patientRecord?.visits?.length > 0 ? (
            <div className="space-y-6">
              {patientRecord.visits.map((visit, index) => (
                <div key={index} className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-800">
                    Visit {index + 1}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoBox
                      label="Visit Date"
                      value={new Date(visit.date).toLocaleDateString()}
                    />
                    <InfoBox
                      label="Next Appointment"
                      value={new Date(
                        visit.next_appointment
                      ).toLocaleDateString()}
                    />
                    <InfoBox label="Reason" value={visit.reason} />
                    <InfoBox
                      label="Blood Pressure"
                      value={visit.vital_signs.blood_pressure}
                    />
                  </div>
                  <InfoBox
                    label="Physician Name"
                    value={"Dr. " + visit.doctor_name}
                  />

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-medium text-[#0d9488] mb-2">
                      Physician Notes
                    </h4>
                    <p className="text-teal-700 leading-relaxed">
                      {visit.physician_notes}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <VitalSign
                      label="Heart Rate"
                      value={`${visit.vital_signs.heart_rate} bpm`}
                    />
                    <VitalSign
                      label="Weight"
                      value={`${visit.vital_signs.weight_lbs} lbs`}
                    />
                    <VitalSign
                      label="Blood Glucose"
                      value={`${visit.vital_signs.blood_glucose_mg_dl} mg/dL`}
                    />
                  </div>
                  <span className="block mt-2 w-auto h-1 bg-sky-200 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No visit data available
            </p>
          )}
        </SectionCard>
      </div>

      {showEditOverviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-teal-50 rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Edit Patient Info
            </h3>
            <form onSubmit={handleOverviewSubmit} className="space-y-4">
              <p className="text-gray-800 font-semibold">Full Name</p>
              <input
                type="text"
                name="name"
                value={formOverviewData.name}
                onChange={handleInputOverviewChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded"
              />

              <p className="text-gray-800 font-semibold">Date of Birth</p>
              <input
                type="date"
                name="date_of_birth"
                value={formOverviewData.date_of_birth}
                onChange={handleInputOverviewChange}
                className="w-full px-4 py-2 border rounded"
              />

              <p className="text-gray-800 font-semibold">Gender</p>
              <select
                name="gender"
                value={formOverviewData.gender}
                onChange={handleInputOverviewChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <p className="text-gray-800 font-semibold">Phone</p>
              <input
                type="text"
                name="phone"
                value={formOverviewData.phone}
                onChange={handleInputOverviewChange}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded"
              />

              <p className="text-gray-800 font-semibold">Address</p>
              <input
                type="text"
                name="addressLine1"
                value={formOverviewData.addressLine1}
                onChange={handleInputOverviewChange}
                placeholder="Address Line 1"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="addressLine2"
                value={formOverviewData.addressLine2}
                onChange={handleInputOverviewChange}
                placeholder="Address Line 2"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditOverviewModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecord_Admin;
