// src/components/CreateJourney.js
import React, { useState } from "react";
import axios from 'axios';

// Import the new components
import FormSection from './FormSection';
import InputField from './InputField';
import FileInput from './FileInput';
import FamilyMembersSection from './FamilyMembersSection';

export default function CreateJourney() {
  const [formData, setFormData] = useState({
    departureDate: "",
    arrivalDate: "",
    travelMedium: "",
    travelItinerary: "",
    hotelName: "",
    hotelContact: "",
    dob: "",
    nationality: "",
    aadhaarNumber: "",
    visaInfo: "",
    identityProof: null,
    photo: null,
    familyMembers: [{ name: "", relation: "", age: "" }],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  const handleFamilyChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFamily = formData.familyMembers.map((member, i) =>
      index === i ? { ...member, [name]: value } : member
    );
    setFormData({ ...formData, familyMembers: updatedFamily });
  };

  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: "", relation: "", age: "" }],
    });
  };
  
  const removeFamilyMember = (index) => {
    const updatedFamily = formData.familyMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, familyMembers: updatedFamily });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const journeyData = new FormData();
    Object.keys(formData).forEach(key => {
      journeyData.append(key, key === 'familyMembers' ? JSON.stringify(formData[key]) : formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/journey", journeyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Server Response: ", response.data);
      alert("Journey Created Successfully ✅");
    } catch (error) {
      console.error("Error submitting the form: ", error);
      alert("Failed to create journey.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Plan Your New Journey</h2>
          <p className="mt-2 text-sm text-gray-500">Please fill in the details below to create your travel plan.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection title="Travel Details">
            <InputField id="departureDate" name="departureDate" label="Departure Date" type="date" value={formData.departureDate} onChange={handleChange} />
            <InputField id="arrivalDate" name="arrivalDate" label="Arrival Date" type="date" value={formData.arrivalDate} onChange={handleChange} />
            <InputField id="travelMedium" name="travelMedium" label="Travel Medium" placeholder="Indigo 6E-204" value={formData.travelMedium} onChange={handleChange} fullWidth />
            <InputField id="travelItinerary" name="travelItinerary" label="Travel Itinerary" placeholder="Briefly describe your travel plan..." value={formData.travelItinerary} onChange={handleChange} isTextArea fullWidth />
          </FormSection>

          <FormSection title="Accommodation">
            <InputField id="hotelName" name="hotelName" label="Hotel Name" placeholder="e.g., The Grand Hotel" value={formData.hotelName} onChange={handleChange} />
            <InputField id="hotelContact" name="hotelContact" label="Hotel Contact No." type="tel" placeholder="+91 12345 67890" value={formData.hotelContact} onChange={handleChange} />
          </FormSection>

          <FormSection title="Personal Information">
            <InputField id="dob" name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
            <InputField id="nationality" name="nationality" label="Nationality" placeholder="e.g., Indian" value={formData.nationality} onChange={handleChange} />
            <InputField id="aadhaarNumber" name="aadhaarNumber" label="Passport/Aadhaar Number" placeholder="XXXX XXXX XXXX" value={formData.aadhaarNumber} onChange={handleChange} />
            <InputField id="visaInfo" name="visaInfo" label="Visa Information (if applicable)" placeholder="e.g., B1/B2, Schengen" value={formData.visaInfo} onChange={handleChange} />
          </FormSection>
          
          <FormSection title="Documents">
            <FileInput id="identityProof" name="identityProof" label="Identity Proof" onChange={handleChange} fileName={formData.identityProof?.name} />
            <FileInput id="photo" name="photo" label="Your Photo" onChange={handleChange} fileName={formData.photo?.name} />
          </FormSection>

          <FamilyMembersSection
            members={formData.familyMembers}
            onChange={handleFamilyChange}
            onAdd={addFamilyMember}
            onRemove={removeFamilyMember}
          />

          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            Create Journey
          </button>
        </form>
      </div>
    </div>
  );
}