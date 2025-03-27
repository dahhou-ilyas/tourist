import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Input component for reusability
const FormInput: React.FC<{
    label: string;
    type: string;
    id: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    step?: string;
}> = ({ 
    label, 
    type, 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    error,
    step 
}) => (
    <div>
        <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            step={step}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                error 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder={placeholder}
        />
        {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2" size={16} /> {error}
            </p>
        )}
    </div>
);

export default FormInput;