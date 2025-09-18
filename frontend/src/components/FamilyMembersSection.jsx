// src/components/FamilyMembersSection.js
import React from 'react';

const inputClass = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

export default function FamilyMembersSection({ members, onChange, onAdd, onRemove }) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Family Members</h3>
      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="flex items-center gap-4">
            <input type="text" name="name" value={member.name} onChange={(e) => onChange(index, e)} placeholder="Name" className={inputClass} />
            <input type="text" name="relation" value={member.relation} onChange={(e) => onChange(index, e)} placeholder="Relation" className={inputClass} />
            <input type="number" name="age" value={member.age} onChange={(e) => onChange(index, e)} placeholder="Age" className={`${inputClass} w-24`} />
            {members.length > 1 && (
              <button type="button" onClick={() => onRemove(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
        + Add Family Member
      </button>
    </div>
  );
}