import React from 'react';
import { 
  MapPin, 
  Building, 
  HandPlatter, 
  AlertTriangle 
} from 'lucide-react';
import Card from '../component/Card';
import CardHeader from '../component/CardHeader';
import CardTitle from '../component/CardTitle';
import CardContent from '../component/CardContent';

const AdminDashboard: React.FC = () => {
    // Statistiques du tableau de bord
    const dashboardStats = [
      { 
        icon: <MapPin />, 
        title: 'Lieux Signalés', 
        value: 42 
      },
      { 
        icon: <AlertTriangle />, 
        title: 'Zones Dangereuses', 
        value: 15 
      },
      { 
        icon: <HandPlatter />, 
        title: 'Restaurants', 
        value: 28 
      },
      { 
        icon: <Building />, 
        title: 'Hôtels', 
        value: 12 
      }
    ];
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de Bord Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader variant="flex" className="pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
  
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Derniers Signalements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Aucun signalement récent</p>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                  Ajouter un Lieu
                </button>
                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors">
                  Gérer les Utilisateurs
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;