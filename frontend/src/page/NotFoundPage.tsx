import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 md:space-y-8 text-center">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200">
          <div className="flex justify-center mb-4 md:mb-6">
            <AlertTriangle
              className="text-yellow-500"
              size={72}
              md:size={96}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4">
            Page Introuvable
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6 leading-relaxed">
            Oups ! La page que vous recherchez semble avoir disparu
            dans les méandres du cyberespace. Pas de panique,
            vous pouvez retourner à la page d'accueil.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3
               bg-blue-600 text-white rounded-lg
               hover:bg-blue-700 transition duration-300
               transform hover:-translate-y-1 hover:scale-105
               shadow-md"
            >
              <Home className="mr-0.5" size={20} />
              Retour à l'Accueil
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-6 py-3
               bg-gray-200 text-gray-800 rounded-lg
               hover:bg-gray-300 transition duration-300
               transform hover:-translate-y-1 hover:scale-105
               shadow-md">
              Page Précédente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;