import React, { useState, useMemo, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { TableView } from './components/TableView';
import { TableStyle, CsvData } from './types';
import { parseCsv } from './utils/csvUtils';

const App: React.FC = () => {
  const [csvInput, setCsvInput] = useState<string>('Name, Role, Department, Location\nJohn Doe, Developer, Engineering, New York\nJane Smith, Designer, Product, London\nSam Brown, Manager, Sales, Austin');
  const [selectedStyle, setSelectedStyle] = useState<TableStyle>(TableStyle.BASIC);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const parsedData: CsvData = useMemo(() => {
    return parseCsv(csvInput);
  }, [csvInput]);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setInstallPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">Dynamic Data Table Creator</h1>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight sm:hidden">Table Creator</h1>
            </div>
          </div>
          
          {installPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install App
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Sidebar Controls (Left on desktop, Top on mobile) */}
          <div className="lg:col-span-4 h-full min-h-[500px]">
            <ControlPanel 
              csvInput={csvInput}
              setCsvInput={setCsvInput}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
            />
          </div>

          {/* Table Preview (Right on desktop, Bottom on mobile) */}
          <div className="lg:col-span-8 h-full min-h-[500px]">
            <TableView 
              data={parsedData}
              styleMode={selectedStyle}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;