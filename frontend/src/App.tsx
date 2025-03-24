import { useState } from "react"

function App() {
  const [userLocation,setUserLocation]=useState<{
    latitude:number,
    longitude:number,
  } | null>(null);

  const getUserLocation = ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },(error) => {
        console.error("Error get user location: ", error);
      })
    }else{
      console.log("Geolocation is not supported by this browser");
    }
  }
  return (
    <>
      <h1>Geolocation App</h1>
      <button onClick={getUserLocation}>Get User Location</button>

      {userLocation && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      )}
    </>
  )
}

export default App
