"use client"; // Ensure client-side rendering

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

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
}: {
  position: [number, number];
  zoom: number;
  setCoordinates: (coords: [number, number]) => void;
  locations: { name: string; coordinates: [number, number] }[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null; // Prevent SSR issues
  }
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-[500px] w-full"
    >
      <MapClickListener setCoordinates={setCoordinates} />{" "}
      {/* Add the listener component */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Selected location</Popup>
      </Marker>
      {locations.map((location, index) => (
        <Marker key={index} position={location.coordinates}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
