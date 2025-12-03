'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// URL da API (ajuste se necessário)
const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const weekdaysPt = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function PredicaoPage() {
  const [formData, setFormData] = useState({
    uf: '',
    municipio: '',
    tipo_acidente: '',
    condicao_metereologica: '',
    hora_media: 12,
    data_acidente: new Date().toISOString().split('T')[0],
  });

  const [mappings, setMappings] = useState({
    ufs: [],
    municipios: {},
    tipo_acidente: [],
    condicao_metereologica: [],
  });
  const [municipioOptions, setMunicipioOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);

  // ✅ Busca mappings da API
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const res = await api.get('/mappings');
        const data = res.data || {};
        const ufs = Array.isArray(data.ufs) ? data.ufs : Object.keys(data.municipios || {});
        setMappings({
          ufs,
          municipios: data.municipios || {},
          tipo_acidente: data.tipo_acidente || [],
          condicao_metereologica: data.condicao_metereologica || [],
        });
        setFormData(prev => ({
          ...prev,
          uf: ufs[0] || '',
          municipio: (data.municipios && data.municipios[ufs[0]]?.[0]) || '',
          tipo_acidente: data.tipo_acidente?.[0] || '',
          condicao_metereologica: data.condicao_metereologica?.[0] || '',
        }));
        setMunicipioOptions(data.municipios[ufs[0]] || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados da API. Verifique se o backend está rodando.');
      }
    };

    fetchMappings();
  }, []);

  // Atualiza opções de município quando a UF muda
  useEffect(() => {
    const opts = mappings.municipios[formData.uf] || [];
    setMunicipioOptions(opts);
    if (!opts.includes(formData.municipio)) {
      setFormData(prev => ({ ...prev, municipio: opts[0] || '' }));
    }
  }, [formData.uf, mappings]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hora_media' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setProbability(null);
    setError(null);

    try {
      const dt = new Date(formData.data_acidente);
      const payload = {
        uf: formData.uf,
        municipio: formData.municipio,
        tipo_acidente: formData.tipo_acidente,
        condicao_metereologica: formData.condicao_metereologica,
        hora_do_dia: formData.hora_media,
        mes: dt.getMonth() + 1,
        dia_semana: weekdaysPt[dt.getDay()],
      };

      const res = await api.post('/predict', payload);
      setPrediction(res.data.predicted_class);
      setProbability(res.data.probability_high_risk);
    } catch (err) {
      console.error(err);
      setError('Erro ao fazer predição. Verifique os dados e a API.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', options = [], min, max }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-purple-300 mb-2">{label}</label>
      {options.length > 0 ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#1a1f3a] border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          min={min}
          max={max}
          className="w-full px-4 py-3 bg-[#1a1f3a] border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#1a1f3a] p-8 rounded-xl shadow-xl border border-purple-500/20">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">Predição de Acidentes</h1>

        {error && (
          <div className="flex items-center p-4 mb-6 text-sm text-red-300 bg-red-900/30 rounded-lg border border-red-500/50">
            <FaExclamationTriangle className="mr-3" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="UF" name="uf" options={mappings.ufs} />
          <InputField label="Município" name="municipio" options={municipioOptions} />
          <InputField label="Tipo de Acidente" name="tipo_acidente" options={mappings.tipo_acidente} />
          <InputField label="Condição Meteorológica" name="condicao_metereologica" options={mappings.condicao_metereologica} />
          <InputField label="Hora Média" name="hora_media" type="number" min={0} max={23} />
          <InputField label="Data do Acidente" name="data_acidente" type="date" />

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading || mappings.ufs.length === 0}
              className={`w-full py-3 rounded-lg font-bold text-lg transition ${
                loading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? <><FaSpinner className="animate-spin mr-2" />Fazendo Predição...</> : 'Fazer Predição'}
            </button>
          </div>
        </form>

        {prediction !== null && (
          <div className="mt-6 p-6 bg-purple-900/40 border border-purple-500/50 rounded-xl text-center">
            <div className="flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Resultado da Predição</h2>
            <p className="text-gray-300 mb-2">Classe prevista (alto risco = 1):</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{prediction}</p>
            <p className="text-gray-300 mt-2">Probabilidade de alto risco: {(probability * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
