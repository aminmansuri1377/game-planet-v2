"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icons
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Fix for default icon issue in React
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Define custom icons
const userLocationIcon = new L.Icon({
  iconUrl: "/images/marker-icon-red.png", // Ensure this matches the public folder structure
  iconRetinaUrl: "/images/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const productLocationIcon = new L.Icon({
  iconUrl: "/images/marker-icon-blue.png", // Ensure this matches the public folder structure
  iconRetinaUrl: "/images/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom component to listen for map clicks
const MapClickListener = ({
  setCoordinates,
}: {
  setCoordinates: (coords: [number, number]) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const handleClick = (event: any) => {
      const { lat, lng } = event.latlng;
      setCoordinates([lat, lng]); // Update coordinates in the parent component
    };

    map.on("click", handleClick); // Attach the click event

    // Clean up the event listener when the component is unmounted
    return () => {
      map.off("click", handleClick);
    };
  }, [map, setCoordinates]);

  return null;
};

export default function MyMap({
  position,
  zoom,
  setCoordinates,
  locations,
  userLocation,
}: {
  position: [number, number];
  zoom: number;
  setCoordinates: (coords: [number, number]) => void;
  locations: { name: string; coordinates: [number, number] }[];
  userLocation: [number, number] | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent SSR issues
  }
  console.log("locations", locations);
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-[400px] w-full rounded-3xl"
    >
      <MapClickListener setCoordinates={setCoordinates} />{" "}
      {/* Add the listener component */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>Your selected location</Popup>
        </Marker>
      )}
      {locations?.map((location, index) => (
        <Marker
          key={index}
          position={location.coordinates}
          icon={productLocationIcon}
        >
          <Popup>
            {location.id} -- {location.name}
          </Popup>
        </Marker>
      ))}
      {position && (
        <Marker position={position} icon={userLocationIcon}>
          <Popup>Your Selected Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
