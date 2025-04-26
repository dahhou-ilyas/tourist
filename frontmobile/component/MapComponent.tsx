import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import type { LocationObject, LocationSubscription } from 'expo-location';
import { getRiskColor } from '@/utils/risk';
import axios from 'axios';
import { API_URL } from '@/utils/url';

export default function MapComponent() {
  const [loc, setLoc] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>("votre_token_ici"); // À remplacer par votre logique d'authentification

  // Shared value pour le cap
  const heading = useSharedValue(0);

  // Style animé pour la flèche
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${heading.value}deg` }]
  }));

  // Fonction pour récupérer les emplacements à proximité
  const fetchNearbyLocations = async (latitude: number, longitude: number) => {
    try {
      
      setLoading(true);
      const response = await axios.get(`${API_URL}/maps/locations/nearby`, {
        params: {
          lat: latitude,
          lng: longitude,
          maxDistance: 1000
        },
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setNearbyLocations(response.data.locations);
    } catch (error) {
      console.error('Erreur lors de la récupération des emplacements:', error);
      alert('Impossible de récupérer les emplacements à proximité');
    } finally {
      setLoading(false);
    }
  };

  // Convertir un angle en point cardinal
  const getCardinalDirection = (angle: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(angle / 45) % 8];
  };

  useEffect(() => {
    let posSub: LocationSubscription;
    let headSub: LocationSubscription;

    (async () => {
      // Demande de permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission accès à la localisation refusée');
        return;
      }

      // Position initiale
      const initial = await Location.getCurrentPositionAsync({});
      setLoc(initial);
      heading.value = initial.coords.heading ?? 0;
      
      // Récupérer les emplacements à proximité lors de l'initialisation
      fetchNearbyLocations(initial.coords.latitude, initial.coords.longitude);

      // Surveillance position
      posSub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // Mise à jour toutes les 3 secondes
          distanceInterval: 10, // Ou tous les 10 mètres
        },
        l => {
          setLoc(l);
          if (l.coords.heading != null) {
            heading.value = withTiming(l.coords.heading, { duration: 200 });
          }
        }
      );

      // Surveillance cap/direction
      headSub = await Location.watchHeadingAsync(h => {
        heading.value = withTiming(h.trueHeading, { duration: 200 });
      });
    })();

    return () => {
      posSub?.remove();
      headSub?.remove();
    };
  }, []);

  // Rafraîchir la liste des emplacements à proximité
  const refreshNearbyLocations = () => {
    if (loc) {
      fetchNearbyLocations(loc.coords.latitude, loc.coords.longitude);
    }
  };

  // Rendu des marqueurs pour les points
  const renderPointMarkers = () => {
    return nearbyLocations
      .filter(item => item.location.type === 'Point')
      .map(point => {
        const [longitude, latitude] = point.location.coordinates;
        return (
          <Marker
            key={point._id}
            coordinate={{ latitude, longitude }}
            title={point.neighborhood}
            description={`${point.city} - ${point.description} (${point.riskLevel})`}
            pinColor={getRiskColor(point.riskLevel)}
          />
        );
      });
  };

  // Rendu des lignes pour les LineString
  const renderLines = () => {
    return nearbyLocations
      .filter(item => item.location.type === 'LineString')
      .map(line => {
        
        const coordinates = line.location.coordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude
        }));
        
        return (
          <Polyline
            key={line._id}
            coordinates={coordinates}
            strokeColor={getRiskColor(line.riskLevel)}
            strokeWidth={3}
          />
        );
      });
  };

  // Rendu des polygones
  const renderPolygons = () => {
    return nearbyLocations
      .filter(item => item.location.type === 'Polygon')
      .map(poly => {
        // Prendre le premier anneau de coordonnées (extérieur du polygone)
        const coordinates = poly.location.coordinates[0].map(([longitude, latitude]) => ({
          latitude,
          longitude
        }));
        
        return (
          <Polygon
            key={poly._id}
            coordinates={coordinates}
            strokeColor={getRiskColor(poly.riskLevel)}
            fillColor={`${getRiskColor(poly.riskLevel)}50`} // Ajouter transparence
            strokeWidth={2}
          />
        );
      });
  };

  if (!loc) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Chargement de la localisation...</Text>
      </View>
    );
  }

  const { latitude, longitude } = loc.coords;
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_DEFAULT}
      >
        {/* Marqueur de l'utilisateur */}
        <Marker coordinate={{ latitude, longitude }}>
          <View style={styles.markerContainer}>
            <View style={styles.locationDot}>
              <Animated.View style={[styles.directionArrow, arrowStyle]} />
            </View>
          </View>
        </Marker>
        
        {/* Afficher tous les emplacements à proximité */}
        {renderPointMarkers()}
        {renderLines()}
        {renderPolygons()}
      </MapView>

      {/* Bouton de rafraîchissement */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={refreshNearbyLocations}
        disabled={loading}
      >
        <Text style={styles.refreshButtonText}>
          {loading ? "Chargement..." : "Rafraîchir"}
        </Text>
      </TouchableOpacity>

      {/* Info cap au bas de l'écran */}
      <View style={styles.headingInfoContainer}>
        <Text style={styles.headingInfoText}>
          {Math.round(heading.value)}° {getCardinalDirection(heading.value)}
        </Text>
      </View>

      {/* Affichage du nombre d'emplacements trouvés */}
      <View style={styles.locationsCountContainer}>
        <Text style={styles.locationsCountText}>
          {nearbyLocations.length} emplacements trouvés
        </Text>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingInfoContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  headingInfoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  directionArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,122,255,0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  locationsCountContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  locationsCountText: {
    color: 'white',
    fontSize: 12,
  },
});