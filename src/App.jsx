import React, { useState, useEffect } from 'react';
import DuplicadosCheckerDosListas from './InputDuplicadosChecker.jsx';
import { DuplicadosMismoArray } from './DuplicadosMismoArray.jsx';
import DiferenciaListas from './DiferenciaListas.jsx';
import ExtractorUnicos from './ExtractorUnicos.jsx';
import RepartidorLeads from './RepartidorLeads.jsx';
import CSVSplitter from './CSVSplitter.jsx';
import PhoneValidator from './PhoneValidator.jsx';
import ExcelSplitter from './ExcelSplitter.jsx';
import SmsRepartidorTriple from './SmsRepartidorTriple.jsx';

function App() {
  // 1. Estados principales
  const [activeTab, setActiveTab] = useState('comparacion');
  const [isHovered, setIsHovered] = useState(false);
  
  // 2. Lógica de Modo Oscuro con LocalStorage para recordar preferencia
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const sidebarWidth = isHovered ? '240px' : '70px';

  const menuItems = [
    { id: 'comparacion', label: 'Comunes (A vs B)', icon: '↔️' },
    { id: 'diferencia', label: 'Únicos (A vs B)', icon: '✨' },
    { id: 'unica', label: 'Repetidos Internos', icon: '📝' },
    { id: 'limpiar', label: 'Deduplicar', icon: '🧼' },
    { id: 'phones', label: 'Validar Teléfonos', icon: '📱' },
    { id: 'repartir', label: 'Repartir Texto', icon: '📋' },
    { id: 'csv', label: 'Separar CSV', icon: '📊' },
    { id: 'excel', label: 'Dividir Excel', icon: '📊' },
    { id: 'sms_triple', label: 'Repartidor SMS Triple', icon: '✉️' },
  ];

  // Estilo dinámico para los botones del menú
  const navButtonStyle = (id) => ({
    width: '100%',
    padding: '16px 22px',
    textAlign: 'left',
    backgroundColor: activeTab === id ? 'var(--accent)' : 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.2s ease',
    borderLeft: activeTab === id ? '4px solid #818cf8' : '4px solid transparent',
    outline: 'none',
    overflow: 'hidden'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      
      {/* SIDEBAR */}
      <aside 
        style={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: 'var(--bg-sidebar)',
          color: 'white',
          position: 'fixed',
          left: 0,
          top: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          boxShadow: '4px 0px 15px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* HEADER: Hamburguesa o Toolbox */}
        <div style={{ 
          height: '75px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderBottom: '1px solid rgba(255,255,255,0.1)' 
        }}>
          {isHovered ? (
            <b style={{ fontSize: '1.1em', letterSpacing: '1px', animation: 'fadeIn 0.3s' }}>🛠️ TOOLBOX</b>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ width: '20px', height: '3px', backgroundColor: 'white', borderRadius: '2px' }}></div>
              <div style={{ width: '20px', height: '3px', backgroundColor: 'white', borderRadius: '2px' }}></div>
              <div style={{ width: '20px', height: '3px', backgroundColor: 'white', borderRadius: '2px' }}></div>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN */}
        <nav style={{ flex: 1, marginTop: '15px' }}>
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              style={navButtonStyle(item.id)} 
              onClick={() => setActiveTab(item.id)}
            >
              <span style={{ fontSize: '1.4em', minWidth: '24px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ 
                opacity: isHovered ? 1 : 0, 
                visibility: isHovered ? 'visible' : 'hidden',
                whiteSpace: 'nowrap',
                fontWeight: activeTab === item.id ? '600' : '400'
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* BOTÓN MODO OSCURO */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            transition: 'background 0.3s'
          }}
        >
          <span style={{ fontSize: '1.2em' }}>{darkMode ? '☀️' : '🌙'}</span>
          {isHovered && <span style={{ fontSize: '0.9em' }}>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>}
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ 
        flex: 1, 
        marginLeft: sidebarWidth, 
        padding: '30px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <header style={{ marginBottom: '25px' }}>
             <h1 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.8em' }}>
               {menuItems.find(i => i.id === activeTab)?.label}
             </h1>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.95em' }}>TLMK Support Suite v2.6</p>
          </header>

          <div className="result-card" style={{ minHeight: '75vh', padding: '30px' }}>
            {activeTab === 'comparacion' && <DuplicadosCheckerDosListas />}
            {activeTab === 'diferencia' && <DiferenciaListas />}
            {activeTab === 'unica' && <DuplicadosMismoArray />}
            {activeTab === 'limpiar' && <ExtractorUnicos />}
            {activeTab === 'phones' && <PhoneValidator />}
            {activeTab === 'repartir' && <RepartidorLeads />}
            {activeTab === 'csv' && <CSVSplitter />}
            {activeTab === 'excel' && <ExcelSplitter />}
            {activeTab === 'sms_triple' && <SmsRepartidorTriple />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;