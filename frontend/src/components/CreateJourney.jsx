import React, { useState } from "react";
import axios from "axios";

// Import components
import FormSection from "./FormSection";
import InputField from "./InputField";
import FamilyMembersSection from "./FamilyMembersSection";

export default function CreateJourney() {
  const [formData, setFormData] = useState({
    departureDate: "",
    arrivalDate: "",
    travelMedium: "",
    travelItinerary: "",
    hotelName: "",
    hotelContactNo: "",
    familyMembers: [{ name: "", relation: "", age: "" }],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFamilyChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFamily = formData.familyMembers.map((member, i) =>
      i === index ? { ...member, [name]: value } : member
    );
    setFormData({ ...formData, familyMembers: updatedFamily });
  };

  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [
        ...formData.familyMembers,
        { name: "", relation: "", age: "" },
      ],
    });
  };

  const removeFamilyMember = (index) => {
    const updatedFamily = formData.familyMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, familyMembers: updatedFamily });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please log in first");
        setIsLoading(false);
        return;
      }

      // Convert age to numbers for family members
      const formattedData = {
        ...formData,
        familyMembers: formData.familyMembers.map(member => ({
          ...member,
          age: Number(member.age) || 0
        }))
      };

      const response = await axios.post(
        "/api/journey/create", // Use relative path or configure base URL
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server Response: ", response.data);
      alert("Journey Created Successfully ✅");
      
      // Reset form after successful submission
      setFormData({
        departureDate: "",
        arrivalDate: "",
        travelMedium: "",
        travelItinerary: "",
        hotelName: "",
        hotelContactNo: "",
        familyMembers: [{ name: "", relation: "", age: "" }],
      });
    } catch (error) {
      console.error("Error submitting the form: ", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert("Failed to create journey. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Plan Your New Journey
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please fill in the details below to create your travel plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection title="Travel Details">
            <InputField
              id="departureDate"
              name="departureDate"
              label="Departure Date"
              type="date"
              value={formData.departureDate}
              onChange={handleChange}
              required
            />
            <InputField
              id="arrivalDate"
              name="arrivalDate"
              label="Arrival Date"
              type="date"
              value={formData.arrivalDate}
              onChange={handleChange}
              required
            />
            <InputField
              id="travelMedium"
              name="travelMedium"
              label="Travel Medium"
              placeholder="Indigo 6E-204"
              value={formData.travelMedium}
              onChange={handleChange}
              fullWidth
            />
            <InputField
              id="travelItinerary"
              name="travelItinerary"
              label="Travel Itinerary"
              placeholder="Briefly describe your travel plan..."
              value={formData.travelItinerary}
              onChange={handleChange}
              isTextArea
              fullWidth
            />
          </FormSection>

          <FormSection title="Accommodation">
            <InputField
              id="hotelName"
              name="hotelName"
              label="Hotel Name"
              placeholder="e.g., The Grand Hotel"
              value={formData.hotelName}
              onChange={handleChange}
            />
            <InputField
              id="hotelContactNo"
              name="hotelContactNo"
              label="Hotel Contact No."
              type="tel"
              placeholder="+91 12345 67890"
              value={formData.hotelContactNo}
              onChange={handleChange}
            />
          </FormSection>

          <FamilyMembersSection
            members={formData.familyMembers}
            onChange={handleFamilyChange}
            onAdd={addFamilyMember}
            onRemove={removeFamilyMember}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
              isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
          >
            {isLoading ? "Creating..." : "Create Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}