'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { FaRobot, FaSpinner, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';

// **ATENÇÃO:** Substitua esta URL pela URL de deploy da sua API (ex: https://sua-api-aqui.onrender.com)
const API_BASE_URL = 'http://127.0.0.1:8000'; 

export default function ChatbotComponent() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const apiEndpoint = `${API_BASE_URL}/chatbot/query`;
      const res = await axios.post(apiEndpoint, { query });
      
      if (res.data.sucesso) {
        setResponse(res.data.resposta);
      } else {
        setError(res.data.mensagem || 'Erro desconhecido ao processar a query.');
      }
    } catch (err) {
      console.error('Erro na chamada do Chatbot:', err);
      setError(err.response?.data?.detail || 'Erro de conexão com a API. Verifique a URL base.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Estilo da Box: Fundo escuro, borda roxa/rosa, sombra
    <div className="p-6 bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-xl shadow-lg border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
        <FaRobot className="mr-2 text-pink-400" /> Chatbot de Análise de Dados
      </h2>
      
      {/* Área de Resposta */}
      <div className="min-h-[150px] p-4 mb-4 bg-[#0B0F1A] border border-purple-500/30 rounded-lg overflow-y-auto text-gray-300">
        {loading && (
          <div className="flex items-center justify-center text-pink-400">
            <FaSpinner className="animate-spin mr-2" /> Processando...
          </div>
        )}
        {error && (
          <div className="text-red-400 flex items-center">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        )}
        {response && (
          <p className="whitespace-pre-wrap">{response}</p>
        )}
        {!loading && !error && !response && (
          <p className="text-gray-500">Pergunte algo sobre os dados de acidentes...</p>
        )}
      </div>

      {/* Formulário de Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Qual dia da semana tem mais acidentes?"
          // Estilo do Input: Fundo escuro, borda roxa/rosa
          className="flex-grow p-3 bg-[#1a1f3a] border border-purple-500/30 text-gray-300 rounded-lg focus:ring-pink-400 focus:border-pink-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          // Estilo do Botão: Gradiente roxo/rosa
          className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200 disabled:bg-gray-600 flex items-center justify-center"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}