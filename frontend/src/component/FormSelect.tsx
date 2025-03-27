import React from 'react';

// Select component for reusability
const FormSelect: React.FC<{
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}> = ({ label, id, name, value, onChange, options }) => (
    <div>
        <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {label}
        </label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default FormSelect;