import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import type { LocationObject, LocationSubscription } from 'expo-location';

export default function MapComponent() {
  const [loc, setLoc] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shared value pour le cap
  const heading = useSharedValue(0);

  // Style animé pour la flèche
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${heading.value}deg` }]
  }));

  // Fonction pour convertir un angle en point cardinal
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

      // Surveillance position
      posSub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
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
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_DEFAULT}
      >
        <Marker coordinate={{ latitude, longitude }}>
          <View style={styles.markerContainer}>
            <View style={styles.locationDot}>
              <Animated.View style={[styles.directionArrow, arrowStyle]} />
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Info cap au bas de l’écran */}
      <View style={styles.headingInfoContainer}>
        <Text style={styles.headingInfoText}>
          {Math.round(heading.value)}° {getCardinalDirection(heading.value)}
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
});
