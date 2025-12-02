'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaChartLine, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// ============================================
// ALTERE ESTA URL CONFORME SEU AMBIENTE
// ============================================
const API_BASE_URL = 'http://127.0.0.1:8000/';
// ============================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 7000,
});

const initialFormData = {
  uf: '',
  municipio: '',
  tipo_acidente: '',
  condicao_metereologica: '',
  hora_media: 12,
  data_acidente: new Date().toISOString().split('T')[0],
};

const weekdaysPt = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado'];

export default function PredicaoPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [mappings, setMappings] = useState({ ufs: [], municipios: {} , tipo_acidente: [], condicao_metereologica: [] });
  const [municipioOptions, setMunicipioOptions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMappings = useCallback(async () => {
    try {
      const response = await api.get('/mappings');
      const data = response?.data || {};

      // municipio dict esperado: { "SP": ["SaoPaulo", ...], ... }
      const municipiosObj = data.municipios && typeof data.municipios === 'object' ? data.municipios : {};

      // Se a API não fornecer 'ufs' explicitamente, derive das chaves de municipios
      const ufsFromApi = Array.isArray(data.ufs) && data.ufs.length > 0 ? data.ufs : Object.keys(municipiosObj || {});

      // Normaliza: trim e ordena
      const ufsClean = ufsFromApi.map(u => String(u).trim()).filter(Boolean).sort((a,b) => a.localeCompare(b, 'pt-BR'));
      const municipiosClean = {};
      Object.entries(municipiosObj).forEach(([uf, arr]) => {
        if (Array.isArray(arr)) {
          municipiosClean[String(uf).trim()] = arr
            .map(m => String(m).trim())
            .filter(Boolean)
            .sort((a,b) => a.localeCompare(b, 'pt-BR'));
        }
      });

      // tipo_acidente e condicao_metereologica (fallbacks seguros)
      const tipo_acidente = Array.isArray(data.tipo_acidente) ? data.tipo_acidente.map(x => String(x).trim()) : [];
      const condicao_metereologica = Array.isArray(data.condicao_metereologica) ? data.condicao_metereologica.map(x => String(x).trim()) : [];

      const defaultUf = ufsClean.length > 0 ? ufsClean[0] : '';
      const defaultMunicipios = municipiosClean[defaultUf] || [];

      setMappings({
        ufs: ufsClean,
        municipios: municipiosClean,
        tipo_acidente,
        condicao_metereologica
      });

      setFormData(prev => ({
        ...prev,
        uf: prev.uf && ufsClean.includes(prev.uf) ? prev.uf : defaultUf,
        municipio: prev.municipio && (municipiosClean[prev.uf] || []).includes(prev.municipio) ? prev.municipio : (defaultMunicipios[0] || ''),
        tipo_acidente: prev.tipo_acidente || (tipo_acidente[0] || ''),
        condicao_metereologica: prev.condicao_metereologica || (condicao_metereologica[0] || '')
      }));

      setMunicipioOptions(defaultMunicipios);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar mappings:', err);
      if (err.response) {
        setError(`API retornou erro ${err.response.status}: ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError(`Sem resposta da API. Verifique se o backend está rodando em ${API_BASE_URL}`);
      } else {
        setError(err.message || 'Erro desconhecido ao contatar API.');
      }
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  // Quando UF muda, atualiza lista de municípios (preservando seleção quando possível)
  useEffect(() => {
    const municipiosObj = mappings.municipios || {};
    const ufsList = mappings.ufs || [];

    if (!formData.uf && ufsList.length > 0) {
      // Se não houver UF selecionada, define a primeira disponível
      setFormData(prev => ({ ...prev, uf: ufsList[0] }));
      setMunicipioOptions(municipiosObj[ufsList[0]] || []);
      return;
    }

    if (formData.uf) {
      const cleanedUf = String(formData.uf).trim();
      const opts = municipiosObj[cleanedUf] || [];
      setMunicipioOptions(opts);

      // se a municipalidade atual não está na nova lista, atualiza para o primeiro município disponível
      setFormData(prev => {
        const currentMunicipio = prev.municipio;
        if (!currentMunicipio || !opts.includes(currentMunicipio)) {
          return { ...prev, municipio: opts[0] || '' };
        }
        return prev;
      });
    } else {
      setMunicipioOptions([]);
    }
  }, [formData.uf, mappings]);

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
    setProbability(null);
    setError(null);

    try {
      // Converte data_acidente em mes e dia_semana (em pt)
      const dt = new Date(formData.data_acidente);
      const mes = dt.getMonth() + 1;
      const diaSemana = weekdaysPt[dt.getDay()];

      // Monta payload compatível com a API
      const payload = {
        hora_do_dia: Number(formData.hora_media),
        mes: mes,
        dia_semana: diaSemana,
        condicao_metereologica: formData.condicao_metereologica,
        uf: formData.uf,
        municipio: formData.municipio
      };

      const response = await api.post('/predict', payload);
      // A API retorna { predicted_class, probability_high_risk }
      setPrediction(response.data.predicted_class);
      setProbability(response.data.probability_high_risk);
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
            <InputField label="UF" name="uf" options={mappings.ufs || []} />
            <InputField label="Município" name="municipio" options={municipioOptions || []} />
            <InputField label="Tipo de Acidente" name="tipo_acidente" options={mappings.tipo_acidente || []} />
            <InputField label="Condição Meteorológica" name="condicao_metereologica" options={mappings.condicao_metereologica || []} />
            <InputField label="Hora Média (0-23)" name="hora_media" type="number" min="0" max="23" />
            <InputField label="Data do Acidente" name="data_acidente" type="date" />

            {/* Botão */}
            <div className="sm:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading || mappings.ufs.length === 0}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                  loading || mappings.ufs.length === 0
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
                Classe prevista (alto risco = 1):
              </p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {prediction}
              </p>
              <p className="text-gray-300 mt-4">
                Probabilidade de alto risco: {(probability * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}