import React, { useState } from 'react';

function CSVSplitter() {
  const [data, setData] = useState({ header: '', rows: [] });
  const [num, setNum] = useState(3);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split(/\r?\n/).filter(l => l.trim() !== '');
      setData({ header: lines[0], rows: lines.slice(1) });
    };
    reader.readAsText(file);
  };

  const download = (content, i) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `parte_${i+1}.csv`; a.click();
  };

  const groups = [];
  if (data.rows.length > 0) {
    const size = Math.ceil(data.rows.length / num);
    for (let i = 0; i < data.rows.length; i += size) {
      groups.push([data.header, ...data.rows.slice(i, i + size)].join('\n'));
    }
  }

  return (
    <div className="tool-section card-result">
      <div className="flex-row">
        <div className="flex-1">
          <label>Selecciona CSV</label>
          <input type="file" accept=".csv" onChange={handleFile} />
        </div>
        <div style={{width:'150px'}}>
          <label>Partes</label>
          <input type="number" value={num} onChange={e => setNum(e.target.value)} />
        </div>
      </div>
      <div className="grid-results">
        {groups.map((g, i) => (
          <div key={i} className="card-result">
            <h4>Parte {i+1}</h4>
            <p className="text-small">Registros: {g.split('\n').length - 1}</p>
            <button className="btn btn-primary" onClick={() => download(g, i)}>Descargar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CSVSplitter;