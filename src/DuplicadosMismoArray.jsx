import React, { useState, useMemo } from 'react';

function DuplicadosMismoArray() {
  const [input, setInput] = useState('');
  
  const dups = useMemo(() => {
    const list = input.replace(/[, \n]+/g, ' ').trim().split(' ').filter(x => x !== '');
    const seen = new Set(); const repeats = new Set();
    list.forEach(n => seen.has(n) ? repeats.add(n) : seen.add(n));
    return Array.from(repeats).sort();
  }, [input]);

  const copy = () => {
    const el = document.createElement("textarea"); el.value = dups.join('\n');
    document.body.appendChild(el); el.select(); document.execCommand('copy');
    document.body.removeChild(el); alert('Copiado');
  };

  return (
    <div className="tool-section card-result">
      <label>Ingresar Lista</label>
      <textarea value={input} onChange={e => setInput(e.target.value)} rows="8" />
      <div className="card-result">
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
          <h4>Repetidos Encontrados ({dups.length})</h4>
          <button className="btn btn-primary" style={{width:'auto'}} onClick={copy} disabled={!dups.length}>Copiar Repetidos</button>
        </div>
        <div className="preview-box" style={{maxHeight:'100px', overflowY:'auto'}}>
          {dups.join(', ') || 'No hay repetidos'}
        </div>
      </div>
    </div>
  );
}

export { DuplicadosMismoArray };