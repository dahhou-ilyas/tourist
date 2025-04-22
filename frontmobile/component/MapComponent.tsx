import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapComponent() {
  const [locationData, setLocationData] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    let positionSubscription: Location.LocationSubscription;
    let headingSubscription: Location.LocationSubscription;
    
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission accès à la localisation refusée');
        return;
      }
      
      // Obtenir la position initiale
      let location = await Location.getCurrentPositionAsync({});
      setLocationData(location);
      setHeading(location.coords.heading);
      
      // Observer les changements de position
      positionSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocationData(loc);
          if (loc.coords.heading !== null) {
            setHeading(loc.coords.heading);
          }
        }
      );
      
      // Observer spécifiquement les changements de cap/direction
      headingSubscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading);
      });
    })();

    return () => {
      if (positionSubscription) {
        positionSubscription.remove();
      }
      if (headingSubscription) {
        headingSubscription.remove();
      }
    };
  }, []);

  if (!locationData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Chargement de la localisation...</Text>
      </View>
    );
  }

  const { latitude, longitude } = locationData.coords;
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Fonction pour convertir les degrés en points cardinaux
  const getCardinalDirection = (angle: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(angle / 45) % 8];
  };

  // Composant personnalisé pour le marqueur avec direction
  const DirectionMarker = () => {
    return (
      <View style={styles.markerContainer}>
        {/* Cercle de localisation bleu */}
        <View style={styles.locationDot}>
          {/* Flèche de direction */}
          <View 
            style={[
              styles.directionArrow, 
              { transform: [{ rotate: `${heading ?? 0}deg` }] }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_DEFAULT}
      >
        {/* Utiliser un marqueur personnalisé avec rotation pour la direction */}
        {heading !== null && (
          <Marker
            coordinate={{ latitude, longitude }}
          >
            <DirectionMarker />
          </Marker>
        )}
      </MapView>
      
      {/* Mini info de direction en bas */}
      {heading !== null && (
        <View style={styles.headingInfoContainer}>
          <Text style={styles.headingInfoText}>
            {Math.round(heading)}° {getCardinalDirection(heading)}
          </Text>
        </View>
      )}

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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
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
    // Ombre
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
  }
});