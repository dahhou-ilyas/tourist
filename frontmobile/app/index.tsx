import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Index() {
  const [locationData, setLocationData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    let positionSubscription;
    (async () => {
      // Demande de permission d'accès à la localisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission d’accès à la localisation refusée');
        return;
      }
      // Récupère la position initiale
      let location = await Location.getCurrentPositionAsync({});
      setLocationData(location);
      setHeading(location.coords.heading);

      // Abonnement au suivi continu de la position (et du cap)
      positionSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocationData(loc);
          setHeading(loc.coords.heading);
        }
      );
    })();

    return () => {
      if (positionSubscription) {
        positionSubscription.remove();
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

  const region = {
    latitude: locationData.coords.latitude,
    longitude: locationData.coords.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        region={region} 
        showsUserLocation={true}
      >
        <Marker 
          coordinate={{
            latitude: locationData.coords.latitude,
            longitude: locationData.coords.longitude
          }}
          title="Vous êtes icixxx"
          // La prop 'rotation' permet de faire pivoter le marqueur selon le cap
          rotation={heading || 0}
        />
      </MapView>
      {heading !== null && (
        <View style={styles.headingContainer}>
          <Text>Direction : {Math.round(heading)}°</Text>
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
  headingContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  errorContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
  },
});
