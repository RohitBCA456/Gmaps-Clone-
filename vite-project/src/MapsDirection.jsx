import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 37.7749, // Default latitude (San Francisco)
  lng: -122.4194, // Default longitude (San Francisco)
};

const MapWithDirections = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${import.meta.env.VITE_API_KEY}`, // Replace with your API key
    libraries: ["places"], // Load the places library for Autocomplete
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const autocompleteOriginRef = useRef(null);
  const autocompleteDestinationRef = useRef(null);

  const calculateRoute = async () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination!");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(result);
    } catch (error) {
      console.error("Error fetching directions:", error);
      alert("Failed to fetch directions.");
    }
  };

  // Log the place object returned by Autocomplete
  const handlePlaceChange = (autocomplete, setAddress) => {
    const place = autocomplete.getPlace();
    console.log("Place Object:", place);  // Log the full place object

    if (place.geometry) {
      setAddress(place.formatted_address);  // Set the formatted address
    } else {
      alert("No details available for the selected place.");
    }
  };

  return isLoaded ? (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Get Directions</h2>

        {/* Origin Input with Autocomplete */}
        <div style={{ marginBottom: "10px" }}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteOriginRef.current = autocomplete)}
            onPlaceChanged={() => handlePlaceChange(autocompleteOriginRef.current, setOrigin)}
          >
            <input
              type="text"
              placeholder="Enter origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{
                width: "300px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "10px",
              }}
            />
          </Autocomplete>
        </div>

        {/* Destination Input with Autocomplete */}
        <div style={{ marginBottom: "20px" }}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteDestinationRef.current = autocomplete)}
            onPlaceChanged={() => handlePlaceChange(autocompleteDestinationRef.current, setDestination)}
          >
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                width: "300px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "10px",
              }}
            />
          </Autocomplete>
        </div>

        {/* Button to calculate route */}
        <button
          onClick={calculateRoute}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Get Directions
        </button>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default MapWithDirections;
