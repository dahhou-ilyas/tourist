
// Separate validation logic into its own function
export const validateLocationForm = (formData: LocationFormData): Partial<LocationFormData> => {
    const newErrors: Partial<LocationFormData> = {};

    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Le quartier est requis';
    
    if (formData.coordinates[0] === 0 && formData.coordinates[1] === 0) {
        newErrors.coordinates = 'Coordonnées invalides';
    }

    return newErrors;
};
