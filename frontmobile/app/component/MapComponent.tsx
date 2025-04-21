import React, { useState, useEffect } from 'react';
import { StyleSheet,View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';



export default function MapComponent(){

    const [locationData, setLocationData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [heading, setHeading] = useState(null);
    

    useEffect(() => {
      let positionSubscription;
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission accès à la localisation refusée');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocationData(location);
        setHeading(location.coords.heading);

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

    const { latitude, longitude } = locationData.coords;

    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    // Une zone polygonale autour de la position (un carré simple ici)
    const polygonCoordinates = [
      { latitude: latitude + 0.001, longitude: longitude - 0.001 },
      { latitude: latitude + 0.001, longitude: longitude + 0.001 },
      { latitude: latitude - 0.001, longitude: longitude + 0.001 },
      { latitude: latitude - 0.001, longitude: longitude - 0.001 },
    ];

    return (
    <View>
        <MapView 
        style={styles.map} 
        region={region} 
        showsUserLocation={true}
        >
        <Marker 
          coordinate={{ latitude, longitude }}
          title="Vous êtes ici"
          rotation={heading || 0}
        />
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="#000"
          fillColor="rgba(0, 200, 0, 0.3)"
          strokeWidth={2}
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
        
    )

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
  