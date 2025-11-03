'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaChartLine, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const API_BASE_URL = 'https://preditor-ofc.onrender.com';

const initialFormData = {
  uf: '',
  municipio: '',
  tipo_acidente: '',
  condicao_metereologica: '',
  hora_media: 12,
  data_acidente: new Date( ).toISOString().split('T')[0],
};

export default function PredicaoPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [mappings, setMappings] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMappings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mappings`);
      setMappings(response.data);
      setFormData(prev => ({
        ...prev,
        uf: response.data.uf ? response.data.uf[0] : '',
        municipio: response.data.municipio ? response.data.municipio[0] : '',
        tipo_acidente: response.data.tipo_acidente ? response.data.tipo_acidente[0] : '',
        condicao_metereologica: response.data.condicao_metereologica ? response.data.condicao_metereologica[0] : '',
      }));
    } catch (err) {
      console.error('Erro ao buscar mappings:', err);
      setError('Erro ao carregar dados de seleção. Verifique se a API está ativa.');
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hora_media' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      console.error('Erro na predição:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.detail || 'Erro ao fazer a predição. Verifique os dados e a API.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', options = [], min, max }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-purple-300 mb-2">
        {label}
      </label>
      {options.length > 0 ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#1a1f3a] border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:border-purple-500/50"
          required
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          min={min}
          max={max}
          className="w-full px-4 py-3 bg-[#1a1f3a] border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:border-purple-500/50"
          required
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f3a] to-[#2d1b4e] p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <FaChartLine className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Predição de Acidentes
          </h1>
          <p className="text-gray-400 text-lg">Insira os parâmetros para prever acidentes rodoviários</p>
        </div>

        {/* Formulário Principal */}
        <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] p-8 rounded-xl shadow-2xl border border-purple-500/20">
          
          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-center p-4 mb-6 text-sm text-red-300 bg-red-900/30 rounded-lg border border-red-500/50">
              <FaExclamationTriangle className="mr-3 h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-medium">Erro:</span> {error}
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="UF" name="uf" options={mappings.uf || []} />
            <InputField label="Município" name="municipio" options={mappings.municipio || []} />
            <InputField label="Tipo de Acidente" name="tipo_acidente" options={mappings.tipo_acidente || []} />
            <InputField label="Condição Meteorológica" name="condicao_metereologica" options={mappings.condicao_metereologica || []} />
            <InputField label="Hora Média (0-23)" name="hora_media" type="number" min="0" max="23" />
            <InputField label="Data do Acidente" name="data_acidente" type="date" />

            {/* Botão */}
            <div className="sm:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading || Object.keys(mappings).length === 0}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                  loading || Object.keys(mappings).length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50'
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Fazendo Predição...
                  </>
                ) : (
                  'Fazer Predição'
                )}
              </button>
            </div>
          </form>

          {/* Resultado da Predição */}
          {prediction !== null && (
            <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-xl shadow-lg text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-green-500/20 rounded-full">
                  <FaCheckCircle className="text-green-400 text-3xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">
                Resultado da Predição
              </h2>
              <p className="text-gray-300 mb-2">
                A quantidade prevista de acidentes é:
              </p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {Math.round(prediction)}
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Baseado nos parâmetros fornecidos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
