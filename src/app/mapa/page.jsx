'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkedAlt, FaRoute, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const API_BASE_URL = 'http://127.0.0.1:8000';

// 🔥 Peso removido
const initialRouteData = {
  origem: '',
  destino: '',
  condicao_metereologica: 'Sol',
};

// Ajusta o mapa para mostrar todas as rotas
const MapViewUpdater = ({ routes }) => {
  const map = useMap();

  useEffect(() => {
    if (!routes || routes.length === 0) return;

    let coordsAll = [];

    routes.forEach((route) => {
      const coords = route.coordenadas.map((c) => [c[1], c[0]]);
      coordsAll = [...coordsAll, ...coords];
    });

    if (coordsAll.length > 0) {
      const bounds = L.latLngBounds(coordsAll);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, map]);

  return null;
};

const MapDisplay = ({ routes, origin, destination }) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="h-96 bg-[#0B0F1A] flex items-center justify-center rounded-lg text-gray-500 border border-purple-500/20">
        <FaMapMarkedAlt className="text-4xl mr-2" /> Insira a origem e o destino para calcular a rota.
      </div>
    );
  }

  const originPos = [origin.latitude, origin.longitude];
  const destinationPos = [destination.latitude, destination.longitude];

  const initialCenter = originPos;

  // 🔥 Cores para múltiplas rotas
  const routeColors = ['#D946EF', '#00FFFF'];

  return (
    <div className="h-96 w-full relative">
      <MapContainer
        center={initialCenter}
        zoom={10}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg border border-purple-500/20"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={originPos} title="Origem" />
        <Marker position={destinationPos} title="Destino" />

        {/* 🔥 Agora desenha 2 rotas */}
        {routes.map((route, index) => {
          const coords = route.coordenadas.map((c) => [c[1], c[0]]);
          return (
            <Polyline
              key={index}
              positions={coords}
              color={routeColors[index % routeColors.length]}
              weight={5}
              opacity={0.8}
            />
          );
        })}

        <MapViewUpdater routes={routes} />
      </MapContainer>

      {/* Box de resumos */}
      <div className="absolute bottom-0 left-0 z-[1000] p-4 bg-[#1a1f3a]/90 m-4 rounded-lg shadow-xl max-w-xs border border-purple-500/20">
        <p className="font-semibold text-purple-400">Rotas Calculadas:</p>
        {routes.map((route, index) => (
          <div key={index} className="mt-2 p-3 border border-pink-400/50 rounded-lg bg-[#2d1b4e]/50 text-sm text-gray-300">
            <p className="font-bold" style={{ color: routeColors[index] }}>
              Rota {index + 1}
            </p>
            <p>Distância: <span className="font-mono text-purple-300">{route.distancia_km.toFixed(2)}</span> km</p>
            <p>Tempo: <span className="font-mono text-purple-300">{route.tempo_min.toFixed(2)}</span> min</p>
            <p>Risco: <span className="font-mono text-purple-300">{route.risco_medio.toFixed(2)}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RouteMapComponent() {
  const [formData, setFormData] = useState(initialRouteData);
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // 🔥 Não tem mais peso_risco
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRouteResult(null);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/routes/calculate`, formData);

      if (res.data.sucesso) {
        setRouteResult(res.data);
      } else {
        setError(res.data.mensagem || 'Erro desconhecido ao calcular a rota.');
      }
    } catch (err) {
      setError('Erro ao conectar com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-xl shadow-lg border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
        <FaRoute className="mr-2 text-pink-400" /> Cálculo de Rotas Otimizadas
      </h2>

      {/* 🔥 Peso removido daqui também */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="origem"
          value={formData.origem}
          onChange={handleChange}
          placeholder="Origem (Ex: Campinas, SP)"
          className="p-3 bg-[#1a1f3a] border border-purple-500/30 text-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="destino"
          value={formData.destino}
          onChange={handleChange}
          placeholder="Destino (Ex: Rio de Janeiro, RJ)"
          className="p-3 bg-[#1a1f3a] border border-purple-500/30 text-gray-300 rounded-lg"
        />

        <select
          name="condicao_metereologica"
          value={formData.condicao_metereologica}
          onChange={handleChange}
          className="p-3 bg-[#1a1f3a] border border-purple-500/30 text-gray-300 rounded-lg"
        >
          <option value="Sol">Sol</option>
          <option value="Chuva">Chuva</option>
          <option value="Nublado">Nublado</option>
          <option value="Nevoeiro">Nevoeiro</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Calcular Rota'}
        </button>
      </form>

      {error && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-400 bg-red-900/30 rounded-lg border border-red-500/50">
          <FaExclamationTriangle className="mr-2" /> {error}
        </div>
      )}

      <MapDisplay
        routes={routeResult?.rotas}
        origin={routeResult?.origem}
        destination={routeResult?.destino}
      />
    </div>
  );
}
