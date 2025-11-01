'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaChartLine, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// URL base da API fornecida pelo usuário
const API_BASE_URL = 'https://preditor-ofc.onrender.com';

// Estrutura inicial dos dados de entrada
const initialFormData = {
  uf: '',
  municipio: '',
  tipo_acidente: '',
  condicao_metereologica: '',
  hora_media: 12,
  data_acidente: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
};

export default function PredicaoPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [mappings, setMappings] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar os mappings categóricos
  const fetchMappings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mappings`);
      setMappings(response.data);
      // Inicializa os campos de seleção com o primeiro valor de cada mapping
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

  // Função para lidar com a mudança nos inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hora_media' ? parseInt(value, 10) : value,
    }));
  };

  // Função para lidar com a submissão do formulário e chamar a API
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

  // Componente de Input Genérico estilizado para Dark Mode
  const InputField = ({ label, name, type = 'text', options = [], min, max }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {options.length > 0 ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
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
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          required
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
    <div className="w-full max-w-2xl">
      {/* Cabeçalho */}
      <header className="flex items-center justify-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 flex items-center">
          <FaChartLine className="mr-3 text-indigo-500" />
          Predição de Acidentes
        </h1>
      </header>


        {/* Formulário Principal - fundo menor e mais elegante */}
        <div className="bg-[#111827] p-8 rounded-xl shadow-xl w-full mx-auto">
          <p className="text-gray-400 mb-6 text-center">
            Insira os parâmetros para prever a quantidade de acidentes rodoviários.
          </p>

          {/* Área de Mensagens (Erro/Sucesso) */}
          {error && (
            <div
              className="flex items-center p-4 mb-6 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-400"
              role="alert"
            >
              <FaExclamationTriangle className="mr-3 h-5 w-5" />
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
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading || Object.keys(mappings).length === 0}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold transition duration-300 ease-in-out ${
                  loading || Object.keys(mappings).length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
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
            <div className="mt-8 p-6 bg-green-900/50 border border-green-700 rounded-xl shadow-inner text-center">
              <h2 className="text-2xl font-bold text-green-400 flex items-center justify-center mb-2">
                <FaCheckCircle className="mr-3 h-6 w-6" />
                Resultado da Predição
              </h2>
              <p className="mt-2 text-xl text-green-200">
                A quantidade prevista de acidentes é:{' '}
                <span className="font-extrabold text-3xl text-green-400">{prediction}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
