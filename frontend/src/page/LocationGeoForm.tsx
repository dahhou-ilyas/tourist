import React, { useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
//au lieu de cette form je doit ajouté les donné a travers un map le admine entrer dans le map et cadrer un surface ou choisire un point et automatiquement les donné sont ajouté
//j'ai travailé sur cette fonctionnalité
interface LocationFormData {
    city: string;
    neighborhood: string;
    locationType: 'Point' | 'LineString' | 'Polygon';
    coordinates: number[];
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
}

const LocationGeoForm: React.FC = () =>{

    const [formData, setFormData] = useState<LocationFormData>({
        city: '',
        neighborhood: '',
        locationType: 'Point',
        coordinates: [0, 0],
        riskLevel: 'medium',
        description: ''
    });

    const [errors, setErrors] = useState<Partial<LocationFormData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Gestion spécifique pour les coordonnées
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

    const validateForm = () => {
        const newErrors: Partial<LocationFormData> = {};
    
        // Validation des champs
        if (!formData.city.trim()) newErrors.city = 'La ville est requise';
        if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Le quartier est requis';
        
        // Validation des coordonnées
        if (formData.coordinates[0] === 0 && formData.coordinates[1] === 0) {
          newErrors.coordinates = 'Coordonnées invalides';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
          // Logique d'envoi du formulaire
          console.log('Formulaire valide:', formData);
          // Appel API ici
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
          <div className="container mx-auto max-w-2xl">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-8 space-y-6">
                {/* Titre */}
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
                  {/* Ville */}
                  <div>
                    <label 
                      htmlFor="city" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                        errors.city 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Ex: Casablanca"
                    />
                    {errors.city && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="mr-2" size={16} /> {errors.city}
                      </p>
                    )}
                  </div>
    
                  {/* Quartier */}
                  <div>
                    <label 
                      htmlFor="neighborhood" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quartier
                    </label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                        errors.neighborhood 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Ex: Hay Mohammadi"
                    />
                    {errors.neighborhood && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="mr-2" size={16} /> {errors.neighborhood}
                      </p>
                    )}
                  </div>
    
                  {/* Coordonnées */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label 
                        htmlFor="coordinate0" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Longitude
                      </label>
                      <input
                        type="number"
                        id="coordinate0"
                        name="coordinate0"
                        step="0.0001"
                        value={formData.coordinates[0]}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: -7.5890"
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="coordinate1" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Latitude
                      </label>
                      <input
                        type="number"
                        id="coordinate1"
                        name="coordinate1"
                        step="0.0001"
                        value={formData.coordinates[1]}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 33.5902"
                      />
                    </div>
                    {errors.coordinates && (
                      <div className="col-span-2 mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="mr-2" size={16} /> {errors.coordinates}
                      </div>
                    )}
                  </div>
    
                  {/* Type de Localisation */}
                  <div>
                    <label 
                      htmlFor="locationType" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Type de Localisation
                    </label>
                    <select
                      id="locationType"
                      name="locationType"
                      value={formData.locationType}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Point">Point</option>
                      <option value="LineString">Ligne</option>
                      <option value="Polygon">Polygone</option>
                    </select>
                  </div>
    
                  {/* Niveau de Risque */}
                  <div>
                    <label 
                      htmlFor="riskLevel" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Niveau de Risque
                    </label>
                    <select
                      id="riskLevel"
                      name="riskLevel"
                      value={formData.riskLevel}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </div>
    
                  {/* Description */}
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
    
                  {/* Bouton de Soumission */}
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
