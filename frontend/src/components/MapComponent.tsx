'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Report {
  id: string;
  title: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  photoUrl?: string;
  createdAt: string;
}

interface MapComponentProps {
  reports: Report[];
}

// Custom icons for different categories
const createCustomIcon = (category: string) => {
  const iconColors: { [key: string]: string } = {
    'theft': '#ef4444',
    'vandalism': '#f97316',
    'assault': '#a855f7',
    'harassment': '#ec4899',
    'burglary': '#eab308',
    'fraud': '#3b82f6',
    'other': '#6b7280',
  };

  const color = iconColors[category.toLowerCase()] || '#6b7280';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let className = 'marker-cluster-small';
  let size = 40;

  if (count < 10) {
    className = 'marker-cluster-small';
    size = 40;
  } else if (count < 100) {
    className = 'marker-cluster-medium';
    size = 50;
  } else {
    className = 'marker-cluster-large';
    size = 60;
  }

  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #ef4444, #dc2626);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size > 40 ? '14px' : '12px'};
      ">
        ${count}
      </div>
    `,
    className: `marker-cluster ${className}`,
    iconSize: [size, size],
  });
};

export default function MapComponent({ reports }: MapComponentProps) {
  return (
    <MapContainer
      center={[12.9716, 77.5946]} // Bangalore coordinates
      zoom={11}
      className="h-96 w-full rounded-lg"
      style={{ zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
      >
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.category)}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 pr-2">{report.title}</h3>
                  <span 
                    className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
                    style={{
                      backgroundColor: (() => {
                        const colors: { [key: string]: string } = {
                          'theft': '#fee2e2',
                          'vandalism': '#fed7aa',
                          'assault': '#f3e8ff',
                          'harassment': '#fce7f3',
                          'burglary': '#fef3c7',
                          'fraud': '#dbeafe',
                        };
                        return colors[report.category.toLowerCase()] || '#f3f4f6';
                      })(),
                      color: (() => {
                        const colors: { [key: string]: string } = {
                          'theft': '#991b1b',
                          'vandalism': '#9a3412',
                          'assault': '#7c3aed',
                          'harassment': '#be185d',
                          'burglary': '#92400e',
                          'fraud': '#1e40af',
                        };
                        return colors[report.category.toLowerCase()] || '#374151';
                      })()
                    }}
                  >
                    {report.category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                {report.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{report.description}</p>
                )}
                
                {report.address && (
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                    <span>📍</span> {report.address}
                  </p>
                )}
                
                {report.photoUrl && (
                  <img
                    src={`http://localhost:3001${report.photoUrl}`}
                    alt="Report"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span>{new Date(report.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}