import React, { useState, useMemo } from 'react';

const parseTextToNumbers = (text) => {
  return text.replace(/[, \n]+/g, ' ').trim().split(' ').filter(str => str !== '');
};

function RepartidorLeads() {
  const [inputData, setInputData] = useState('');
  const [numGrupos, setNumGrupos] = useState(5);

  const todosLosLeads = useMemo(() => parseTextToNumbers(inputData), [inputData]);

  const gruposDistribuidos = useMemo(() => {
    if (todosLosLeads.length === 0 || numGrupos <= 0) return [];
    const resultado = [];
    const tamanoGrupo = Math.ceil(todosLosLeads.length / numGrupos);
    for (let i = 0; i < todosLosLeads.length; i += tamanoGrupo) {
      resultado.push(todosLosLeads.slice(i, i + tamanoGrupo));
    }
    return resultado;
  }, [todosLosLeads, numGrupos]);

  const copiarGrupo = (indice) => {
    const texto = gruposDistribuidos[indice].join('\n');
    const textArea = document.createElement("textarea");
    textArea.value = texto; document.body.appendChild(textArea);
    textArea.select(); document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(`Grupo ${indice + 1} copiado`);
  };

  return (
    <div className="tool-section card-result">
      <div className="flex-row">
        <div className="flex-1">
          <label>Leads a repartir:</label>
          <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} rows="6" />
        </div>
        <div style={{ width: '200px' }}>
          <label>Número de grupos:</label>
          <input type="number" value={numGrupos} onChange={(e) => setNumGrupos(parseInt(e.target.value) || 1)} />
          <p className="text-small" style={{ marginTop: '10px' }}>Total Leads: <span className="badge">{todosLosLeads.length}</span></p>
        </div>
      </div>

      <div className="flex-row">
        {gruposDistribuidos.map((grupo, index) => (
          <div key={index} className="card-result" style={{ minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>Grupo {index + 1}</h4>
              <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={() => copiarGrupo(index)}>Copiar</button>
            </div>
            <div className="text-small">Cantidad: {grupo.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepartidorLeads;