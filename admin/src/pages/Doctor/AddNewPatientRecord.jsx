import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import {
  UserCircleIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  BeakerIcon,
  CalendarIcon,
  TrashIcon,
  ClipboardCheckIcon,
  PlusIcon
} from '@heroicons/react/solid';
import { SectionCard,  } from '../../components/Cards';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

const AddNewPatientRecord = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { dToken, createPatientRecord } = useContext(DoctorContext);
  
  // Main record state
  const [newRecord, setNewRecord] = useState({
    name: '',
    gender: 'male',
    date_of_birth: '',
    contact: {
      phone: '',
      address: {
        line1: '',
        line2: ''
      }
    },
    medications: [],
    medical_history: [],
    allergies: [],
    immunizations: [],
    visits: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (path, value) => {
    const paths = path.split('.');
    setNewRecord(prev => ({
      ...prev,
      [paths[0]]: paths.length > 1 ? {
        ...prev[paths[0]],
        [paths[1]]: paths.length > 2 ? {
          ...prev[paths[0]][paths[1]],
          [paths[2]]: value
        } : value
      } : value
    }));
  };

  // Medication change handler
  const handleMedicationChange = (index, field, value) => {
    setNewRecord(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  // Allergy change handler
  const handleAllergyChange = (index, value) => {
    setNewRecord(prev => ({
      ...prev,
      allergies: prev.allergies.map((allergy, i) => 
        i === index ? value : allergy
      )
    }));
  };
  const handleMedicalHistoryChange = (index, value) => {
    setNewRecord(prev => ({
      ...prev,
      medical_history: prev.medical_history.map((item, i) => 
        i === index ? value : item
      )
    }));
  };
  
  const handleDeleteMedicalHistory = (index) => {
    setNewRecord(prev => ({
      ...prev,
      medical_history: prev.medical_history.filter((_, i) => i !== index)
    }));
  };
  
  const handleVisitChange = (index, field, value) => {
    setNewRecord(prev => ({
      ...prev,
      visits: prev.visits.map((visit, i) => 
        i === index ? {
          ...visit,
          [field]: field.startsWith('vital_signs') 
            ? {
              ...visit.vital_signs,
              [field.split('.')[1]]: value
            }
            : value
        } : visit
      )
    }));
  };
  
  const handleDeleteVisit = (index) => {
    setNewRecord(prev => ({
      ...prev,
      visits: prev.visits.filter((_, i) => i !== index)
    }));
  };
  
  // Immunization change handler
  const handleImmunizationChange = (index, field, value) => {
    setNewRecord(prev => ({
      ...prev,
      immunizations: prev.immunizations.map((imm, i) => 
        i === index ? { ...imm, [field]: value } : imm
      )
    }));
  };

  
  const handleDeleteImmunization = (index) => {
    setNewRecord(prev => ({
      ...prev,
      immunizations: prev.immunizations.filter((_, i) => i !== index)
    }));
  };
// Add these delete handlers to the component
const handleDeleteMedication = (index) => {
  setNewRecord(prev => ({
    ...prev,
    medications: prev.medications.filter((_, i) => i !== index)
  }));
};

const handleDeleteAllergy = (index) => {
  setNewRecord(prev => ({
    ...prev,
    allergies: prev.allergies.filter((_, i) => i !== index)
  }));
};

  // Add new entry to array fields
  const addArrayItem = (arrayName, item) => {
    setNewRecord(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], item]
    }));
  };

  // Submit new record
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createPatientRecord(patientId, newRecord);
      toast.success('Patient record created successfully!');
      navigate(`/doctor/patientrecord_doctor/${patientId}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create patient record');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dToken) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <PlusIcon className="w-6 h-6 text-green-500" />
          Create New Patient Record
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <SectionCard icon={<UserCircleIcon className="w-6 h-6 text-blue-500" />} title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newRecord.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={newRecord.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={newRecord.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={newRecord.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newRecord.contact.address.line1}
                  onChange={(e) => handleInputChange('contact.address.line1', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (Optional)"
                  value={newRecord.contact.address.line2}
                  onChange={(e) => handleInputChange('contact.address.line2', e.target.value)}
                  className="w-full p-2 border rounded-md mt-2"
                />
              </div>
            </div>
          </SectionCard>
{/* Medications Section */}
<SectionCard icon={<ClipboardCheckIcon className="w-6 h-6 text-purple-500" />} title="Medications">
  <div className="space-y-4">
    {newRecord.medications.map((med, index) => (
      <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Dosage</label>
              <input
                type="text"
                value={med.dosage}
                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Frequency</label>
              <input
                type="text"
                value={med.frequency}
                onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDeleteMedication(index)}
            className="text-red-500 hover:text-red-600 ml-2"
            title="Delete medication"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('medications', { name: '', dosage: '', frequency: '' })}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <PlusIcon className="w-4 h-4" />
      Add Medication
    </button>
  </div>
</SectionCard>

{/* Allergies Section */}
<SectionCard icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />} title="Allergies">
  <div className="space-y-4">
    {newRecord.allergies.map((allergy, index) => (
      <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
        <input
          type="text"
          value={allergy}
          onChange={(e) => handleAllergyChange(index, e.target.value)}
          className="w-full p-2 border rounded-md flex-1"
        />
        <button
          type="button"
          onClick={() => handleDeleteAllergy(index)}
          className="text-red-500 hover:text-red-600 ml-2"
          title="Delete allergy"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('allergies', '')}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <PlusIcon className="w-4 h-4" />
      Add Allergy
    </button>
  </div>
</SectionCard>
<SectionCard icon={<DocumentTextIcon className="w-6 h-6 text-green-600" />} title="Medical History">
  <div className="space-y-4">
    {newRecord.medical_history.map((item, index) => (
      <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
        <input
          type="text"
          value={item}
          onChange={(e) => handleMedicalHistoryChange(index, e.target.value)}
          className="w-full p-2 border rounded-md flex-1"
          placeholder="Enter medical condition"
        />
        <button
          type="button"
          onClick={() => handleDeleteMedicalHistory(index)}
          className="text-red-500 hover:text-red-600"
          title="Delete medical history"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('medical_history', '')}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <PlusIcon className="w-4 h-4" />
      Add Medical History
    </button>
  </div>
</SectionCard>

<SectionCard icon={<BeakerIcon className="w-6 h-6 text-blue-500" />} title="Immunizations">
  <div className="space-y-4">
    {newRecord.immunizations.map((imm, index) => (
      <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div>
              <label className="text-sm font-medium text-gray-700">Vaccine</label>
              <input
                type="text"
                value={imm.vaccine}
                onChange={(e) => handleImmunizationChange(index, 'vaccine', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Vaccine name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Doses</label>
              <input
                type="number"
                value={imm.doses}
                onChange={(e) => handleImmunizationChange(index, 'doses', e.target.value)}
                className="w-full p-2 border rounded-md"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={imm.date}
                onChange={(e) => handleImmunizationChange(index, 'date', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDeleteImmunization(index)}
            className="text-red-500 hover:text-red-600"
            title="Delete immunization"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('immunizations', { vaccine: '', doses: '', date: '' })}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <PlusIcon className="w-4 h-4" />
      Add Immunization
    </button>
  </div>
</SectionCard>
<SectionCard icon={<CalendarIcon className="w-6 h-6 text-indigo-500" />} title="Visits">
  <div className="space-y-4">
    {newRecord.visits.map((visit, index) => (
      <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Visit Date</label>
            <input
              type="date"
              value={visit.date}
              onChange={(e) => handleVisitChange(index, 'date', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Next Appointment</label>
            <input
              type="date"
              value={visit.next_appointment}
              onChange={(e) => handleVisitChange(index, 'next_appointment', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Reason</label>
            <input
              type="text"
              value={visit.reason}
              onChange={(e) => handleVisitChange(index, 'reason', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Physician Notes</label>
            <textarea
              value={visit.physician_notes}
              onChange={(e) => handleVisitChange(index, 'physician_notes', e.target.value)}
              className="w-full p-2 border rounded-md h-24"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Vital Signs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Blood Pressure</label>
              <input
                type="text"
                value={visit.vital_signs.blood_pressure}
                onChange={(e) => handleVisitChange(index, 'vital_signs.blood_pressure', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Heart Rate</label>
              <input
                type="number"
                value={visit.vital_signs.heart_rate}
                onChange={(e) => handleVisitChange(index, 'vital_signs.heart_rate', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Weight (lbs)</label>
              <input
                type="number"
                value={visit.vital_signs.weight_lbs}
                onChange={(e) => handleVisitChange(index, 'vital_signs.weight_lbs', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Blood Glucose</label>
              <input
                type="number"
                value={visit.vital_signs.blood_glucose_mg_dl}
                onChange={(e) => handleVisitChange(index, 'vital_signs.blood_glucose_mg_dl', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleDeleteVisit(index)}
            className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
          >
            <TrashIcon className="w-4 h-4" />
            Remove Visit
          </button>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('visits', {
        date: '',
        reason: '',
        doctor_name: '',
        doctor_id: patientId,
        vital_signs: {
          blood_pressure: '',
          heart_rate: 0,
          weight_lbs: 0,
          blood_glucose_mg_dl: 0,
        },
        physician_notes: '',
        next_appointment: ''
      })}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
    >
      <PlusIcon className="w-4 h-4" />
      Add Visit
    </button>
  </div>
</SectionCard>


          {/* Submit Section */}
          <div className="mt-8 border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loading className="w-5 h-5" />
                  Creating Record...
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  Create Patient Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewPatientRecord;