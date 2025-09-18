import React, { useState } from 'react';

// --- Reusable InputField Component for the new design ---
const InputField = ({ id, label, type = 'text', value, onChange, placeholder, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// --- Reusable TextareaField Component ---
const TextareaField = ({ id, label, value, onChange, placeholder, rows = 3, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// --- Reusable FileUploadField Component ---
const FileUploadField = ({ id, label, onFileChange, fileName }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                    <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id={id} name={id} type="file" className="sr-only" accept="image/*,application/pdf" onChange={onFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                {fileName && <p className="text-sm mt-2 text-green-600 font-semibold">{fileName}</p>}
            </div>
        </div>
    </div>
);


// --- Main KYC Form Component ---
export default function KYCForm({ kycData = {}, setKycData }) {
  const [photoFileName, setPhotoFileName] = useState("");
  const [idProofFileName, setIdProofFileName] = useState("");

  const updateField = (field, value) => {
    setKycData({ ...kycData, [field]: value });
  };

  const handleFileChange = (e, fieldName, setFileName) => {
    const file = e.target.files[0];
    if (file) {
      updateField(fieldName, file);
      setFileName(file.name);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">KYC Verification</h1>
          <p className="text-gray-500 mt-2">Please fill in the details below to complete your verification.</p>
        </div>

        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Personal Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <InputField id="fullName" label="Full Name (as per official ID)" value={kycData.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Enter your full name" />
              </div>

              <InputField id="dob" label="Date of Birth" type="date" value={kycData.dob} onChange={(e) => updateField("dob", e.target.value)} />
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select id="gender" value={kycData.gender || ''} onChange={(e) => updateField("gender", e.target.value)} className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <InputField id="nationality" label="Nationality" value={kycData.nationality} onChange={(e) => updateField("nationality", e.target.value)} placeholder="e.g., Indian" />
              <InputField id="mobile" label="Mobile Number" type="tel" value={kycData.mobile} onChange={(e) => updateField("mobile", e.target.value)} placeholder="+91 12345 67890" />
              <InputField id="email" label="Email Address" type="email" value={kycData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" />
              
              <div className="md:col-span-2">
                <TextareaField id="address" label="Current Residential Address" value={kycData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Enter your full address" />
              </div>
            </div>
          </section>

          {/* Section 2: Identity Proof Details */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700">Identity Proof Details</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField id="aadhaar" label="Aadhaar Card Number" value={kycData.aadhaar} onChange={(e) => updateField("aadhaar", e.target.value)} placeholder="XXXX XXXX XXXX" />
              <InputField id="passport" label="Passport Number (Optional)" value={kycData.passport} onChange={(e) => updateField("passport", e.target.value)} placeholder="Enter passport number" required={false} />
              <InputField id="visa" label="Visa (if available)" value={kycData.visa} onChange={(e) => updateField("visa", e.target.value)} placeholder="Enter visa details" required={false} />
            </div>
          </section>

          {/* Section 3: Document Upload */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700">Document Upload</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField 
                    id="photo" 
                    label="Upload Your Photograph" 
                    onFileChange={(e) => handleFileChange(e, "photo", setPhotoFileName)} 
                    fileName={photoFileName} 
                />
                <FileUploadField 
                    id="identityProof" 
                    label="Upload Identity Proof Document" 
                    onFileChange={(e) => handleFileChange(e, "identityProof", setIdProofFileName)} 
                    fileName={idProofFileName} 
                />
            </div>
          </section>

        </form>
      </div>
    </div>
  );
}

