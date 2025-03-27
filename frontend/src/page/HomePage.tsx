import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLoginNavigation = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            
            {/* Content Section */}
            <div className="p-8 space-y-6 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
                <Lock 
                  className="text-blue-500 mr-3" 
                  size={36} 
                />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  Tableau de Bord
                </h1>
              </div>

              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Bienvenue sur notre plateforme de gestion administrative exclusive. 
                Cet espace sécurisé est conçu uniquement pour les administrateurs, 
                offrant un accès centralisé aux outils de gestion, aux rapports 
                détaillés et aux fonctionnalités de contrôle stratégique. Votre 
                connexion garantit la confidentialité et l'intégrité de nos 
                systèmes d'information.
              </p>

              <div className="pt-4">
                <button
                  onClick={handleLoginNavigation}
                  className="w-full md:w-auto flex items-center justify-center 
                  mx-auto px-6 py-3 bg-blue-600 text-white 
                  font-semibold rounded-lg shadow-md 
                  hover:bg-blue-700 transition duration-300 
                  ease-in-out transform hover:-translate-y-1 
                  hover:scale-105 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  focus:ring-offset-2"
                >
                  <Lock className="mr-2" size={20} />
                  Connexion Administrateur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;