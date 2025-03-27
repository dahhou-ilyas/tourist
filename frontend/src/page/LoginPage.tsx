import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle ,Eye,EyeClosed} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      console.log(err);
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Lock 
                  className="text-blue-500 mr-2" 
                  size={36} 
                  strokeWidth={2} 
                />
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Connexion Admin
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Accédez à votre tableau de bord administratif
              </p>
            </div>

            {/* Login Form */}
            <form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              {/* Username Input */}
              <div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 
                    rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm transition duration-300"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 
                    rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm transition duration-300"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition"
                  >
                    {isPasswordVisible ? (
                      <Eye/>
                    ) : (
                      <EyeClosed/>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="mr-2" size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 
                  border border-transparent rounded-md shadow-md 
                  text-white bg-blue-600 hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 transition duration-300 
                  transform hover:-translate-y-1 hover:scale-105"
                >
                  <Lock className="mr-2" size={20} />
                  Se Connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;