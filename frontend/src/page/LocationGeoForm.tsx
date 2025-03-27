import React, { useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import { validateLocationForm } from '../utils/validationForm';
import FormInput from '../component/FormInput';
import FormSelect from '../component/FormSelect';

// Define types in a separate interface file
export interface LocationFormData {
    city: string;
    neighborhood: string;
    locationType: 'Point' | 'LineString' | 'Polygon';
    coordinates: number[];
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
}


const LocationGeoForm: React.FC = () => {
    // Initial form state
    const [formData, setFormData] = useState<LocationFormData>({
        city: '',
        neighborhood: '',
        locationType: 'Point',
        coordinates: [0, 0],
        riskLevel: 'medium',
        description: ''
    });

    // Error state
    const [errors, setErrors] = useState<Partial<LocationFormData>>({});

    // Generic change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Special handling for coordinates
        if (name.startsWith('coordinate')) {
            const index = name === 'coordinate0' ? 0 : 1;
            const newCoordinates = [...formData.coordinates];
            newCoordinates[index] = parseFloat(value);
            
            setFormData(prev => ({
                ...prev,
                coordinates: newCoordinates
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Form submission handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formErrors = validateLocationForm(formData);
        
        if (Object.keys(formErrors).length === 0) {
            // Form is valid
            console.log('Formulaire valide:', formData);
            // API call would go here
        } else {
            // Set errors
            setErrors(formErrors);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <MapPin 
                                    className="text-blue-500 mr-2" 
                                    size={36} 
                                    strokeWidth={2} 
                                />
                                <h2 className="text-3xl font-extrabold text-gray-900">
                                    Ajouter une Localisation
                                </h2>
                            </div>
                            <p className="text-gray-600">
                                Saisissez les détails géographiques précis
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* City Input */}
                            <FormInput 
                                label="Ville"
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Ex: Casablanca"
                                error={errors.city}
                            />

                            {/* Neighborhood Input */}
                            <FormInput 
                                label="Quartier"
                                type="text"
                                id="neighborhood"
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                placeholder="Ex: Hay Mohammadi"
                                error={errors.neighborhood}
                            />

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput 
                                    label="Longitude"
                                    type="number"
                                    id="coordinate0"
                                    name="coordinate0"
                                    value={formData.coordinates[0]}
                                    onChange={handleChange}
                                    placeholder="Ex: -7.5890"
                                    step="0.0001"
                                />
                                <FormInput 
                                    label="Latitude"
                                    type="number"
                                    id="coordinate1"
                                    name="coordinate1"
                                    value={formData.coordinates[1]}
                                    onChange={handleChange}
                                    placeholder="Ex: 33.5902"
                                    step="0.0001"
                                />
                                {errors.coordinates && (
                                    <div className="col-span-2 mt-2 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="mr-2" size={16} /> {errors.coordinates}
                                    </div>
                                )}
                            </div>

                            {/* Location Type Select */}
                            <FormSelect 
                                label="Type de Localisation"
                                id="locationType"
                                name="locationType"
                                value={formData.locationType}
                                onChange={handleChange}
                                options={[
                                    { value: 'Point', label: 'Point' },
                                    { value: 'LineString', label: 'Ligne' },
                                    { value: 'Polygon', label: 'Polygone' }
                                ]}
                            />

                            {/* Risk Level Select */}
                            <FormSelect 
                                label="Niveau de Risque"
                                id="riskLevel"
                                name="riskLevel"
                                value={formData.riskLevel}
                                onChange={handleChange}
                                options={[
                                    { value: 'low', label: 'Faible' },
                                    { value: 'medium', label: 'Moyen' },
                                    { value: 'high', label: 'Élevé' }
                                ]}
                            />

                            {/* Description Textarea */}
                            <div>
                                <label 
                                    htmlFor="description" 
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Détails supplémentaires sur la localisation"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 
                                    border border-transparent rounded-md shadow-md 
                                    text-white bg-blue-600 hover:bg-blue-700 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-blue-500 transition duration-300 
                                    transform hover:-translate-y-1 hover:scale-105"
                                >
                                    <MapPin className="mr-2" size={20} />
                                    Ajouter la Localisation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationGeoForm;