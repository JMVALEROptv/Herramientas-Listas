import React, { useState, useMemo } from 'react';

const PhoneValidator = () => {
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const lines = input.split(/\r?\n/).filter(line => line.trim() !== '');
    const results = { mobiles: [], landlines: [], invalid: [] };

    lines.forEach(line => {
      let clean = line.replace(/\D/g, '');
      if (clean.length === 11 && clean.startsWith('34')) clean = clean.substring(2);

      if (clean.length === 9) {
        if (clean.startsWith('6') || clean.startsWith('7')) results.mobiles.push(clean);
        else if (clean.startsWith('8') || clean.startsWith('9')) results.landlines.push(clean);
        else results.invalid.push(line + " (Prefijo raro)");
      } else if (clean !== '') results.invalid.push(line + ` (L:${clean.length})`);
    });
    return results;
  }, [input]);

  const copyToClipboard = (array) => {
    const text = array.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => alert('¡Copiado!'));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text; document.body.appendChild(textArea);
      textArea.select(); document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copiado (Legacy)');
    }
  };

  return (
    <div className="tool-container card-result">
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Pega números aquí..."
        rows="6"
      />
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div className="result-card" style={{ borderTop: '4px solid #22c55e' }}>
          <h4>📱 Móviles ({stats.mobiles.length})</h4>
          <button className="btn-primary" onClick={() => copyToClipboard(stats.mobiles)} disabled={!stats.mobiles.length}>Copiar</button>
        </div>
        <div className="result-card" style={{ borderTop: '4px solid #3b82f6' }}>
          <h4>☎️ Fijos ({stats.landlines.length})</h4>
          <button className="btn-primary" onClick={() => copyToClipboard(stats.landlines)} disabled={!stats.landlines.length}>Copiar</button>
        </div>
        <div className="result-card" style={{ borderTop: '4px solid #ef4444' }}>
          <h4>⚠️ Inválidos ({stats.invalid.length})</h4>
          <div style={{ fontSize: '0.8em', color: '#ef4444' }}>{stats.invalid.slice(0, 5).join(', ')}</div>
        </div>
      </div>
    </div>
  );
};

export default PhoneValidator;