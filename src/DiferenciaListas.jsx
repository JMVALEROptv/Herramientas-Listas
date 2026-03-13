import React, { useState, useMemo } from 'react';

const parseText = (text) => text.replace(/[, \n]+/g, ' ').trim().split(' ').filter(x => x !== '');

const copy = (arr) => {
  const t = arr.join('\n');
  const el = document.createElement("textarea"); el.value = t;
  document.body.appendChild(el); el.select(); document.execCommand('copy');
  document.body.removeChild(el); alert('Copiado');
};

function DiferenciaListas() {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');

  const res = useMemo(() => {
    const a = parseText(inputA); const b = parseText(inputB);
    const setA = new Set(a); const setB = new Set(b);
    return {
      soloA: a.filter(x => !setB.has(x)),
      soloB: b.filter(x => !setA.has(x))
    };
  }, [inputA, inputB]);

  return (
    <div className="tool-section card-result">
      <div className="flex-row ">
        <div className="flex-1">
          <label>Lista A</label>
          <textarea value={inputA} onChange={e => setInputA(e.target.value)} rows="5" />
        </div>
        <div className="flex-1">
          <label>Lista B</label>
          <textarea value={inputB} onChange={e => setInputB(e.target.value)} rows="5" />
        </div>
      </div>
      <div className="flex-row">
        <div className="card-result flex-1">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h4 style={{color:'var(--danger)'}}>Solo en A ({res.soloA.length})</h4>
            <button className="btn btn-outline" onClick={() => copy(res.soloA)}>Copiar</button>
          </div>
          <p className="text-small">{res.soloA.slice(0,10).join(', ')}...</p>
        </div>
        <div className="card-result flex-1">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h4 style={{color:'var(--accent)'}}>Solo en B ({res.soloB.length})</h4>
            <button className="btn btn-outline" onClick={() => copy(res.soloB)}>Copiar</button>
          </div>
          <p className="text-small">{res.soloB.slice(0,10).join(', ')}...</p>
        </div>
      </div>
    </div>
  );
}

export default DiferenciaListas;