// src/components/FileInput.js
import React from 'react';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const fileInputLabelClass = "cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function FileInput({ id, name, label, onChange, fileName }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        name={name}
        id={id}
        onChange={onChange}
        className="sr-only"
      />
      <label htmlFor={id} className={fileInputLabelClass}>
        <UploadIcon />
        Choose File
      </label>
      <span className="ml-3 text-sm text-gray-500">
        {fileName || "No file selected."}
      </span>
    </div>
  );
}