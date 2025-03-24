import { useEffect, useState } from "react";

function App() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error watching user location:", error);
        },
        {
          enableHighAccuracy: false, // ou supprime-le
  timeout: 20000,
  maximumAge: 1000
        }
      );

      // Nettoyage à la désactivation ou changement de page
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }, []);

  return (
    <>
      <h1>Live Geolocation Tracker</h1>
      {userLocation ? (
        <div>
          <h2>📍 Real-time Location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      ) : (
        <p>Waiting for location...</p>
      )}
    </>
  );
}

export default App;
