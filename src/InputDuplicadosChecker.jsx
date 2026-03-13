import React, { useState, useMemo } from 'react';

const parseTextToNumbers = (text) => {
  return text.replace(/[, \n]+/g, ' ').trim().split(' ').filter(str => str !== '');
};

const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => alert('Copiado'));
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text; document.body.appendChild(textArea);
    textArea.select(); document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Copiado');
  }
};

function DuplicadosCheckerDosListas() {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');

  const listaA = useMemo(() => parseTextToNumbers(inputA), [inputA]);
  const listaB = useMemo(() => parseTextToNumbers(inputB), [inputB]);
  
  const duplicados = useMemo(() => {
    if (listaA.length === 0 || listaB.length === 0) return [];
    const setB = new Set(listaB);
    return Array.from(new Set(listaA.filter(x => setB.has(x)))).sort();
  }, [listaA, listaB]);

  return (
    <div className="tool-section card-result">
      <div className="flex-row">
        <div className="flex-1">
          <label>Lista A:</label>
          <textarea value={inputA} onChange={(e) => setInputA(e.target.value)} rows="6" placeholder="Pega lista A..." />
          <p className="text-small">Ítems: <span className="badge">{listaA.length}</span></p>
        </div>
        <div className="flex-1">
          <label>Lista B:</label>
          <textarea value={inputB} onChange={(e) => setInputB(e.target.value)} rows="6" placeholder="Pega lista B..." />
          <p className="text-small">Ítems: <span className="badge">{listaB.length}</span></p>
        </div>
      </div>

      <div className="card-result">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 className="text-success" style={{ margin: 0 }}>🤝 Números en Ambas Listas ({duplicados.length})</h4>
          <button className="btn btn-primary" onClick={() => copyToClipboard(duplicados.join('\n'))} disabled={!duplicados.length}>
            Copiar Resultados
          </button>
        </div>
        <div className="preview-box" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {duplicados.length > 0 ? duplicados.join(', ') : 'No hay coincidencias'}
        </div>
      </div>
    </div>
  );
}

export default DuplicadosCheckerDosListas;