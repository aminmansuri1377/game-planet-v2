// components/MapComponent.jsx
import MapContainer from "react-leaflet/MapContainer";
import TileLayer from "react-leaflet/TileLayer";
import { useMapEvents } from "react-leaflet";

const LocationMarker = ({ onSelectLocation }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelectLocation({ latitude: lat, longitude: lng });
      map.flyTo([lat, lng], map.getZoom());
    },
  });

  return null;
};

const MapComponent = ({ onSelectLocation }) => {
  const defaultPosition = [37.7749, -122.4194]; // Default to San Francisco

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onSelectLocation={onSelectLocation} />
    </MapContainer>
  );
};

export default MapComponent;
