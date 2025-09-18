// src/components/FormSection.js
import React from 'react';

export default function FormSection({ title, children }) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}