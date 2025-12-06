import React, { useState } from 'react';
import { TableStyle } from '../types';
import { generateSampleCsvData } from '../services/geminiService';

interface ControlPanelProps {
  csvInput: string;
  setCsvInput: (val: string) => void;
  selectedStyle: TableStyle;
  setSelectedStyle: (style: TableStyle) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  csvInput,
  setCsvInput,
  selectedStyle,
  setSelectedStyle,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('Sales Data');

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const data = await generateSampleCsvData(topic);
      setCsvInput(data);
    } catch (e) {
      alert("Failed to generate data. Please check your API configuration or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!csvInput.trim()) return;
    
    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(["\ufeff" + csvInput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col gap-6">
      
      {/* Input Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="csv-input" className="block text-sm font-semibold text-slate-700">
            CSV Input
          </label>
          <button 
            onClick={handleDownload}
            disabled={!csvInput.trim()}
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 disabled:text-slate-300 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            title="Download current data as CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>
        <textarea
          id="csv-input"
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          className="flex-1 w-full p-4 rounded-lg border border-slate-300 bg-slate-50 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all placeholder:text-slate-400"
          placeholder={`Name, Age, Role\nAlice, 28, Designer\nBob, 34, Developer\nCharlie, 22, Intern`}
        />
      </div>

      {/* AI Generator Section */}
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          AI Magic Fill
        </h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 text-sm rounded border border-indigo-200 px-3 py-2 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Employee List"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-4 py-2 rounded text-sm font-medium text-white transition-colors flex items-center gap-2
              ${isGenerating ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      {/* Style Controls */}
      <div className="border-t border-slate-100 pt-4">
        <span className="block text-sm font-semibold text-slate-700 mb-3">Table Style</span>
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
            <input
              type="radio"
              name="tableStyle"
              value={TableStyle.BASIC}
              checked={selectedStyle === TableStyle.BASIC}
              onChange={() => setSelectedStyle(TableStyle.BASIC)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="ml-3 block text-sm font-medium text-slate-900">Basic Table</span>
          </label>
          
          <label className="flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
            <input
              type="radio"
              name="tableStyle"
              value={TableStyle.STRIPED}
              checked={selectedStyle === TableStyle.STRIPED}
              onChange={() => setSelectedStyle(TableStyle.STRIPED)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="ml-3 block text-sm font-medium text-slate-900">Striped Table</span>
          </label>

          <label className="flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
            <input
              type="radio"
              name="tableStyle"
              value={TableStyle.BORDERED_HOVER}
              checked={selectedStyle === TableStyle.BORDERED_HOVER}
              onChange={() => setSelectedStyle(TableStyle.BORDERED_HOVER)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="ml-3 block text-sm font-medium text-slate-900">Bordered & Hover</span>
          </label>
        </div>
      </div>
    </div>
  );
};