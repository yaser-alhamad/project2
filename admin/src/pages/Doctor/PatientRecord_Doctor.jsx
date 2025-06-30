import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";

import {
  UserCircleIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  BeakerIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  PencilAltIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import {
  SectionCard,
  VitalSign,
  InfoBox,
  InfoItem,
} from "../../components/Cards";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
const PatientRecord_Doctor = () => {
  const { id } = useParams();

  const { dToken, getPatientRecord, patientRecord, editPatientRecord } =
    useContext(DoctorContext);
  // State for editing the patient overview
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  // State for editing the patient medications
  const [showEditMedicationsModal, setShowEditMedicationsModal] =
    useState(false);
  // State for adding a new medical history
  const [showAddMedicalHistoryModal, setShowAddMedicalHistoryModal] =
    useState(false);
  // State for adding a new allergy
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  // State for adding a new immunization
  const [showAddImmunizationModal, setShowAddImmunizationModal] =
    useState(false);
  // State for adding a new visit
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
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
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });

  // State for new allergy inputs
  const [newAllergy, setNewAllergy] = useState("");

  // State for new medical history inputs
  const [newMedicalHistory, setNewMedicalHistory] = useState("");

  // State for new immunization inputs
  const [newImmunization, setNewImmunization] = useState({
    vaccine: "",
    doses: "",
    date: "",
  });
  const [newVisit, setNewVisit] = useState({
    date: "", // Date of the visit
    reason: "", // Reason for visit
    doctor_name: "",
    doctor_id: "",
    vital_signs: {
      blood_pressure: "",
      heart_rate: 0,
      weight_lbs: 0,
      blood_glucose_mg_dl: 0,
    },
    physician_notes: "",
    next_appointment: "",
  });
  useEffect(() => {
    if (dToken) {
      getPatientRecord(id);
    }
  }, [id, dToken]);

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
    if (showEditMedicationsModal) {
      setNewMedication({
        name: patientRecord?.medications?.[0]?.name || "",
        dosage: patientRecord?.medications?.[0]?.dosage || "",
        frequency: patientRecord?.medications?.[0]?.frequency || "",
      });
    }
    if (showAddMedicalHistoryModal) {
      setNewMedicalHistory(patientRecord?.medical_history?.[0] || "");
    }
    if (showAddAllergyModal) {
      setNewAllergy(patientRecord?.allergies?.[0] || "");
    }
    if (showAddImmunizationModal) {
      setNewImmunization({
        vaccine: patientRecord?.immunizations?.[0]?.vaccine || "",
        doses: patientRecord?.immunizations?.[0]?.doses || "",
        date: patientRecord?.immunizations?.[0]?.date || "",
      });
      setNewVisit({
        date: patientRecord?.visits?.[0]?.date || "",
        reason: patientRecord?.visits?.[0]?.reason || "",
        vital_signs: patientRecord?.visits?.[0]?.vital_signs || "",
        physician_notes: patientRecord?.visits?.[0]?.physician_notes || "",
        next_appointment: patientRecord?.visits?.[0]?.next_appointment || "",
      });
    }
  }, [patientRecord]);

  const handleInputOverviewChange = (e) => {
    const { name, value } = e.target;
    setFormOverviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverviewSubmit = (e) => {
    e.preventDefault();
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

  // Handle change for new medication fields
  const handleNewMedicationChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({ ...prev, [name]: value }));
  };

  // Add new medication to the patient's list
  const handleAddMedication = (e) => {
    e.preventDefault();
    const { name, dosage, frequency } = newMedication;

    if (!name || !dosage || !frequency) {
      toast.error("Please fill in all fields before adding a medication.");
      return;
    }

    const updatedData = {
      ...patientRecord,
      medications: [...patientRecord.medications, newMedication],
    };
    editPatientRecord(id, updatedData);
    // Reset the new medication form
    setNewMedication({ name: "", dosage: "", frequency: "" });
    setShowEditMedicationsModal(false);
  };

  // Delete a medication from the list
  const handleDeleteMedication = (_id) => {
    const updatedData = {
      ...patientRecord,
      medications: patientRecord.medications.filter((med) => med._id !== _id),
    };
    editPatientRecord(id, updatedData);
  };

  // Handle change for new medical history fields
  const handleNewMedicalHistoryChange = (e) => {
    setNewMedicalHistory(e.target.value);
  };

  // Add new medical history to the patient's list
  const handleAddMedicalHistory = (e) => {
    e.preventDefault();
    if (!newMedicalHistory.trim()) {
      toast.error("Please enter a valid medical history.");
      return;
    }
    const updatedData = {
      ...patientRecord,
      medical_history: [...patientRecord.medical_history, newMedicalHistory],
    };
    editPatientRecord(id, updatedData);
    setNewMedicalHistory("");
    setShowAddMedicalHistoryModal(false);
  };

  // Delete a medical history item from the list
  const handleDeleteMedicalHistory = (index) => {
    const updatedData = {
      ...patientRecord,
      medical_history: patientRecord.medical_history.filter(
        (_, i) => i !== index
      ),
    };
    editPatientRecord(id, updatedData);
  };

  // Handle change for new allergy fields
  const handleNewAllergyChange = (e) => {
    setNewAllergy(e.target.value);
  };

  // Add new allergy to the patient's list
  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (!newAllergy.trim()) {
      toast.error("Please enter a valid allergy.");
      return;
    }
    const updatedData = {
      ...patientRecord,
      allergies: [...patientRecord.allergies, newAllergy],
    };
    editPatientRecord(id, updatedData);
    setNewAllergy("");
    setShowAddAllergyModal(false);
  };

  // Delete an allergy from the list
  const handleDeleteAllergy = (index) => {
    const updatedData = {
      ...patientRecord,
      allergies: patientRecord.allergies.filter((_, i) => i !== index),
    };
    editPatientRecord(id, updatedData);
  };

  // Handle change for new immunization fields
  const handleNewImmunizationChange = (e) => {
    const { name, value } = e.target;
    setNewImmunization((prev) => ({ ...prev, [name]: value }));
  };

  // Add new immunization to the patient's list
  const handleAddImmunization = (e) => {
    e.preventDefault();

    if (
      !newImmunization.vaccine ||
      !newImmunization.doses ||
      !newImmunization.date
    ) {
      toast.error("Please fill in all fields before adding an immunization.");
      return;
    }
    const updatedData = {
      ...patientRecord,
      immunizations: [...patientRecord.immunizations, newImmunization],
    };
    editPatientRecord(id, updatedData);
    setNewImmunization({ vaccine: "", doses: "", date: "" });
    setShowAddImmunizationModal(false);
  };

  // Delete an immunization from the list
  const handleDeleteImmunization = (index) => {
    const updatedData = {
      ...patientRecord,
      immunizations: patientRecord.immunizations.filter((_, i) => i !== index),
    };
    editPatientRecord(id, updatedData);
  };

  // Handle change for new visit fields
  const handleNewVisitChange = (e) => {
    const { name, value } = e.target;
    setNewVisit((prev) => ({ ...prev, [name]: value }));
  };

  // Add new visit to the patient's list
  const handleAddVisit = (e) => {
    e.preventDefault();
    if (
      !newVisit.date ||
      !newVisit.reason ||
      !newVisit.vital_signs ||
      !newVisit.physician_notes ||
      !newVisit.docName
    ) {
      toast.error("Please fill in all fields before adding a visit.");
      return;
    }
    const updatedData = {
      ...patientRecord,
      visits: [...patientRecord.visits, newVisit],
    };
    editPatientRecord(id, updatedData);
    setNewVisit({
      date: "",
      reason: "",
      doctor_name: "",
      doctor_id: id,
      vital_signs: {
        blood_pressure: "",
        heart_rate: 0,
        weight_lbs: 0,
        blood_glucose_mg_dl: 0,
      },
      physician_notes: "",
      next_appointment: "",
    });
    setShowAddVisitModal(false);
  };

  // Delete a visit from the list
  const handleDeleteVisit = (index) => {
    const updatedData = {
      ...patientRecord,
      visits: patientRecord.visits.filter((_, i) => i !== index),
    };
    editPatientRecord(id, updatedData);
  };
  if (!patientRecord || patientRecord.length === 0) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="bg-gradient-to-br to-indigo-50 rounded-2xl p-8 shadow-lg border border-sky-100">
          <div className="flex items-center gap-3 mb-6">
            <UserCircleIcon className="w-8 h-8 text-sky-600" />
            <h2 className="text-2xl font-bold text-sky-900">
              Patient Overview
            </h2>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowEditOverviewModal(true)}
              className="flex items-center gap-1 text-sm text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
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
                    <button
                      onClick={() => handleDeleteMedicalHistory(idx)}
                      title="Delete Medical History"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <li>No medical history available</li>
              )}
            </ul>
            <div className="flex justify-end mt-4 flex-col gap-2">
              <button
                onClick={() => setShowAddMedicalHistoryModal(true)}
                className="flex items-center gap-1 text-sm text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Medical History
              </button>
            </div>
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
                    <button
                      onClick={() => handleDeleteMedication(med._id)}
                      title="Delete Medication"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <p>No medications available</p>
              )}
            </div>
            <div className="flex justify-end mt-4 flex-col gap-2">
              <button
                onClick={() => setShowEditMedicationsModal(true)}
                className="flex items-center gap-1 text-sm text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Medication
              </button>
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
                    <div className="flex items-center gap-2">
                      {allergy}
                      <button
                        onClick={() => handleDeleteAllergy(idx)}
                        title="Delete Allergy"
                      >
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </span>
                ))
              ) : (
                <span>No allergies available</span>
              )}
            </div>
            <div className="flex justify-end mt-4 flex-col gap-2">
              <button
                onClick={() => setShowAddAllergyModal(true)}
                className="flex items-center gap-1 text-sm text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Allergy
              </button>
            </div>
          </SectionCard>

          <SectionCard
            icon={<BeakerIcon className="w-6 h-6 text-blue-500" />}
            title="Immunizations"
          >
            <ul className="space-y-2">
              {patientRecord?.immunizations?.length > 0 ? (
                patientRecord.immunizations.map((imm, idx) => (
                  <div
                    key={imm._id}
                    className="flex  items-center justify-between border-l-4 border-blue-100 pl-3"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-gray-800">{imm.vaccine}</p>
                      <p className="text-sm text-gray-500">
                        Doses: {imm.doses} • Date:{" "}
                        {new Date(imm.date).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteImmunization(idx)}
                      title="Delete Immunization"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <li>No immunizations available</li>
              )}
            </ul>
            <div className="flex justify-end mt-4 flex-col gap-2">
              <button
                onClick={() => setShowAddImmunizationModal(true)}
                className="flex items-center gap-1 text-sm text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Immunization
              </button>
            </div>
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
                  <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 ">
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

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-[#0d9488] mb-2">
                      Physician Notes
                    </h4>
                    <p className="text-blue-700 leading-relaxed">
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
                    <button
                      onClick={() => handleDeleteVisit(index)}
                      title="Delete Visit"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  <span className="block mt-2 w-1/3 h-1 bg-sky-200 rounded-full mx-auto" />
                </div>
              ))}
              <div className="flex justify-end mt-4 items-center flex-col gap-2">
                <button
                  onClick={() => setShowAddVisitModal(true)}
                  className="flex items-center gap-1 w-auto text-sm text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg shadow-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <p className="text-sm">Add New Visit</p>
                </button>
              </div>
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
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
      {showEditMedicationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Add Medications
            </h3>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <p className="text-gray-800 font-semibold">Medication Name</p>
              <input
                type="text"
                name="name"
                value={newMedication.name}
                onChange={handleNewMedicationChange}
                placeholder="Medication Name"
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Dosage</p>
              <input
                type="text"
                name="dosage"
                value={newMedication.dosage}
                onChange={handleNewMedicationChange}
                placeholder="Dosage"
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Frequency</p>
              <input
                type="text"
                name="frequency"
                value={newMedication.frequency}
                onChange={handleNewMedicationChange}
                placeholder="Frequency"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditMedicationsModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddMedicalHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Add Medical History
            </h3>
            <form onSubmit={handleAddMedicalHistory} className="space-y-4">
              <p className="text-gray-800 font-semibold">Medical History</p>
              <input
                type="text"
                name="medicalHistory"
                value={newMedicalHistory}
                onChange={handleNewMedicalHistoryChange}
                placeholder="Medical History"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedicalHistoryModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddAllergyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Add Allergy</h3>
            <form onSubmit={handleAddAllergy} className="space-y-4">
              <p className="text-gray-800 font-semibold">Allergy</p>
              <input
                type="text"
                name="allergy"
                value={newAllergy}
                onChange={handleNewAllergyChange}
                placeholder="Allergy"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAllergyModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddImmunizationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Add Immunization
            </h3>
            <form onSubmit={handleAddImmunization} className="space-y-4">
              <p className="text-gray-800 font-semibold">Vaccine</p>
              <input
                type="text"
                name="vaccine"
                value={newImmunization.vaccine}
                onChange={handleNewImmunizationChange}
                placeholder="Vaccine"
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Doses</p>
              <input
                type="number"
                name="doses"
                value={newImmunization.doses}
                onChange={handleNewImmunizationChange}
                placeholder="Doses"
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Date</p>
              <input
                type="date"
                name="date"
                value={newImmunization.date}
                onChange={handleNewImmunizationChange}
                placeholder="Date"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddImmunizationModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Add Visit</h3>
            <form onSubmit={handleAddVisit} className="space-y-2">
              <p className="text-gray-800 font-semibold">Date</p>
              <input
                type="date"
                name="date"
                value={newVisit.date}
                onChange={handleNewVisitChange}
                placeholder="Date"
                className="w-full px-4 py-2 border rounded"
              />

              <p className="text-gray-800 font-semibold">Reason</p>
              <input
                type="text"
                name="reason"
                value={newVisit.reason}
                onChange={handleNewVisitChange}
                placeholder="Reason"
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Physician Name</p>
              <input
                type="text"
                name="doctor_name"
                value={newVisit.doctor_name}
                onChange={handleNewVisitChange}
                placeholder="Physician Name"
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Vital Signs</p>
              <div className="flex flex-shrink gap-2">
                <span className="flex flex-col gap-1 items-center justify-center">
                  <p className="text-gray-600 text-sm font-semibold">
                    Blood Pressure
                  </p>
                  <input
                    type="text"
                    name="vital_signs"
                    onChange={handleNewVisitChange}
                    className="w-full px-2   py-2 border rounded"
                  />
                </span>
                <span className="flex flex-col gap-1 items-center justify-center">
                  <p className="text-gray-600 text-sm font-semibold">
                    Heart Rate
                  </p>
                  <input
                    type="number"
                    name="vital_signs"
                    onChange={handleNewVisitChange}
                    className="w-full px-2  py-2 border rounded"
                  />
                </span>
                <span className="flex flex-col gap-1 items-center justify-center">
                  <p className="text-gray-600 text-sm font-semibold">Weight</p>
                  <input
                    type="number"
                    name="vital_signs"
                    onChange={handleNewVisitChange}
                    className="w-full px-2  py-2 border rounded"
                  />
                </span>
                <span className="flex flex-col gap-1 items-center justify-center  ">
                  <p className="text-gray-600 text-sm font-semibold">
                    Blood Glucose
                  </p>
                  <input
                    type="number"
                    name="vital_signs"
                    onChange={handleNewVisitChange}
                    className="w-full px-2  py-2 border rounded"
                  />
                </span>
              </div>

              <p className="text-gray-800 font-semibold">Physician Notes</p>
              <textarea
                type="text"
                name="physician_notes"
                rows={5}
                value={newVisit.physician_notes}
                onChange={handleNewVisitChange}
                placeholder="Physician Notes"
                className="w-full px-2 py-2 border rounded"
              />
              <p className="text-gray-800 font-semibold">Next Appointment</p>
              <input
                type="date"
                name="next_appointment"
                value={newVisit.next_appointment}
                onChange={handleNewVisitChange}
                placeholder="Next Appointment"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVisitModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecord_Doctor;
