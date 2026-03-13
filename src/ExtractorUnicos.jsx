import React, { useState, useMemo } from 'react';

function ExtractorUnicos() {
  const [inputData, setInputData] = useState('');
  
  const unicos = useMemo(() => {
    const todos = inputData.replace(/[, \n]+/g, ' ').trim().split(' ').filter(str => str !== '');
    return Array.from(new Set(todos)).sort();
  }, [inputData]);

  const copiar = () => {
    const textArea = document.createElement("textarea");
    textArea.value = unicos.join('\n'); document.body.appendChild(textArea);
    textArea.select(); document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Lista limpia copiada');
  };

  return (
    <div className="tool-section card-result">
      <label>Lista con duplicados:</label>
      <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} rows="10" placeholder="Pega aquí tu base de datos..." />
      
      <div className="card-result" style={{ borderTop: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>Resultado Único</h4>
            <p className="text-small">Has eliminado <span className="text-danger">{inputData.split(/\s+/).filter(x=>x).length - unicos.length}</span> duplicados.</p>
          </div>
          <button className="btn btn-primary" onClick={copiar} disabled={!unicos.length}>
            Copiar {unicos.length} registros
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtractorUnicos;