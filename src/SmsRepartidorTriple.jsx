import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';

const parseText = (text) => text.replace(/[, \n]+/g, ' ').trim().split(' ').filter(x => x !== '');

const DEFAULT_MSG = "EN PTV Telecom ESTAMOS LOCOS DE REMATE. Llevate a tu casa FIBRA por solo 9.95 EUROS al mes. LINEA MOVIL 100 GB desde 5.95 EUR. Precio definitivo. Llama 1650.";
const header = "TEXTO DEL SMS;Nº TELEFONO MÓVIL PTV";

function SmsRepartidorTriple() {
  const [listA, setListA] = useState('');
  const [listB, setListB] = useState('');
  const [listC, setListC] = useState('');
  const [listD, setListD] = useState('');

  const [msgA, setMsgA] = useState(DEFAULT_MSG);
  const [msgB, setMsgB] = useState(DEFAULT_MSG);
  const [msgC, setMsgC] = useState(DEFAULT_MSG);
  const [msgD, setMsgD] = useState(DEFAULT_MSG);

  const [cantA, setCantA] = useState(100);
  const [cantB, setCantB] = useState(100);
  const [cantC, setCantC] = useState(100);
  const [cantD, setCantD] = useState(100);

  const [numDias, setNumDias] = useState(3);
  const [baseFileName, setBaseFileName] = useState('Campaña_SMS');

  const parsedA = useMemo(() => parseText(listA), [listA]);
  const parsedB = useMemo(() => parseText(listB), [listB]);
  const parsedC = useMemo(() => parseText(listC), [listC]);
  const parsedD = useMemo(() => parseText(listD), [listD]);

  const warnings = useMemo(() => ({
    a: parsedA.length < (cantA * numDias),
    b: parsedB.length < (cantB * numDias),
    c: parsedC.length < (cantC * numDias),
    d: parsedD.length < (cantD * numDias),
  }), [parsedA, parsedB, parsedC, parsedD, cantA, cantB, cantC, cantD, numDias]);

  const dataProcesada = useMemo(() => {
    const dias = [];
    for (let i = 0; i < numDias; i++) {
      const sliceA = parsedA.slice(i * cantA, (i + 1) * cantA);
      const sliceB = parsedB.slice(i * cantB, (i + 1) * cantB);
      const sliceC = parsedC.slice(i * cantC, (i + 1) * cantC);
      const sliceD = parsedD.slice(i * cantD, (i + 1) * cantD);

      const filas = [
        ...sliceA.map(num => `${msgA};${num}`),
        ...sliceB.map(num => `${msgB};${num}`),
        ...sliceC.map(num => `${msgC};${num}`),
        ...sliceD.map(num => `${msgD};${num}`),
      ];

      if (filas.length > 0) {
        dias.push([header, ...filas].join('\n'));
      }
    }
    return dias;
  }, [parsedA, parsedB, parsedC, parsedD, cantA, cantB, cantC, cantD, msgA, msgB, msgC, msgD, numDias]);

  const downloadZip = async () => {
    const zip = new JSZip();
    const folderName = baseFileName.trim() || 'SMS_Export';
    const BOM = '\uFEFF';
    dataProcesada.forEach((content, idx) => {
      zip.file(`${folderName}_Dia_${idx + 1}.csv`, BOM + content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${folderName}_Completo.zip`;
    link.click();
  };

  const totalDia = cantA + cantB + cantC + cantD;

  return (
    <div className="tool-section">
      {/* ── LAYOUT PRINCIPAL: listas izquierda | config derecha ── */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

        {/* ── IZQUIERDA: grid 2x2 de listas ── */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* LISTA 1 */}
          <div className="card-result" style={{ padding: '10px', backgroundColor: 'var(--bg-main)', borderTop: '3px solid #4e9af1' }}>
            <label>Lista 1 ({parsedA.length} total)</label>
            <textarea value={listA} onChange={e => setListA(e.target.value)} rows="4" placeholder="Números..." style={{ width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Mensaje SMS:</label>
            <textarea value={msgA} onChange={e => setMsgA(e.target.value)} rows="3" placeholder="Mensaje para Lista 1..." style={{ fontSize: '11px', width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Cant. por día:</label>
            <input type="number" value={cantA} onChange={e => setCantA(parseInt(e.target.value) || 0)} style={{ width: '100%' }} />
            {warnings.a && <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '5px' }}>⚠️ Faltan {(cantA * numDias) - parsedA.length} números</p>}
          </div>

          {/* LISTA 2 */}
          <div className="card-result" style={{ padding: '10px', backgroundColor: 'var(--bg-main)', borderTop: '3px solid #f1a24e' }}>
            <label>Lista 2 ({parsedB.length} total)</label>
            <textarea value={listB} onChange={e => setListB(e.target.value)} rows="4" placeholder="Números..." style={{ width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Mensaje SMS:</label>
            <textarea value={msgB} onChange={e => setMsgB(e.target.value)} rows="3" placeholder="Mensaje para Lista 2..." style={{ fontSize: '11px', width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Cant. por día:</label>
            <input type="number" value={cantB} onChange={e => setCantB(parseInt(e.target.value) || 0)} style={{ width: '100%' }} />
            {warnings.b && <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '5px' }}>⚠️ Faltan {(cantB * numDias) - parsedB.length} números</p>}
          </div>

          {/* LISTA 3 */}
          <div className="card-result" style={{ padding: '10px', backgroundColor: 'var(--bg-main)', borderTop: '3px solid #4ef17a' }}>
            <label>Lista 3 ({parsedC.length} total)</label>
            <textarea value={listC} onChange={e => setListC(e.target.value)} rows="4" placeholder="Números..." style={{ width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Mensaje SMS:</label>
            <textarea value={msgC} onChange={e => setMsgC(e.target.value)} rows="3" placeholder="Mensaje para Lista 3..." style={{ fontSize: '11px', width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Cant. por día:</label>
            <input type="number" value={cantC} onChange={e => setCantC(parseInt(e.target.value) || 0)} style={{ width: '100%' }} />
            {warnings.c && <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '5px' }}>⚠️ Faltan {(cantC * numDias) - parsedC.length} números</p>}
          </div>

          {/* LISTA 4 */}
          <div className="card-result" style={{ padding: '10px', backgroundColor: 'var(--bg-main)', borderTop: '3px solid #f14e4e' }}>
            <label>Lista 4 ({parsedD.length} total)</label>
            <textarea value={listD} onChange={e => setListD(e.target.value)} rows="4" placeholder="Números..." style={{ width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Mensaje SMS:</label>
            <textarea value={msgD} onChange={e => setMsgD(e.target.value)} rows="3" placeholder="Mensaje para Lista 4..." style={{ fontSize: '11px', width: '100%' }} />
            <label style={{ marginTop: '8px' }}>Cant. por día:</label>
            <input type="number" value={cantD} onChange={e => setCantD(parseInt(e.target.value) || 0)} style={{ width: '100%' }} />
            {warnings.d && <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '5px' }}>⚠️ Faltan {(cantD * numDias) - parsedD.length} números</p>}
          </div>

        </div>

        {/* ── DERECHA: panel de configuración y descarga ── */}
        <div className="card-result" style={{
          width: '260px',
          flexShrink: 0,
          padding: '16px',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'sticky',
          top: '16px'
        }}>

          {/* Nombre campaña */}
          <div>
            <label style={{ fontWeight: 'bold' }}>📁 Nombre de la Campaña</label>
            <input
              type="text"
              value={baseFileName}
              onChange={(e) => setBaseFileName(e.target.value)}
              style={{ width: '100%', marginTop: '6px' }}
            />
          </div>

          {/* Días */}
          <div>
            <label style={{ fontWeight: 'bold' }}>📅 Días totales</label>
            <input
              type="number"
              value={numDias}
              onChange={e => setNumDias(parseInt(e.target.value) || 1)}
              style={{ width: '100%', marginTop: '6px', fontSize: '1.2em', textAlign: 'center' }}
            />
          </div>

          {/* Resumen por lista */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📊 SMS por día</label>
            {[
              { label: 'Lista 1', cant: cantA, color: '#4e9af1' },
              { label: 'Lista 2', cant: cantB, color: '#f1a24e' },
              { label: 'Lista 3', cant: cantC, color: '#4ef17a' },
              { label: 'Lista 4', cant: cantD, color: '#f14e4e' },
            ].map(({ label, cant, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color }}>{label}</span>
                <span className="badge" style={{ fontSize: '12px' }}>{cant}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Total / día</span>
              <span className="badge" style={{ fontSize: '1.1em' }}>{totalDia}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total campaña</span>
              <span className="badge" style={{ fontSize: '12px' }}>{totalDia * numDias}</span>
            </div>
          </div>

          {/* Botón descarga */}
          <button
            className="btn btn-primary"
            onClick={downloadZip}
            disabled={dataProcesada.length === 0}
            style={{ backgroundColor: 'var(--success)', width: '100%', padding: '12px 0', fontSize: '1em', marginTop: 'auto' }}
          >
            📦 Descargar ZIP<br />
            <span style={{ fontSize: '0.8em', opacity: 0.85 }}>({numDias} archivos CSV)</span>
          </button>

        </div>
      </div>

      {/* ── PREVIEW DE DÍAS ── */}
      <div className="grid-results" style={{ marginTop: '16px' }}>
        {dataProcesada.map((_, idx) => (
          <div key={idx} className="card-result">
            <h4>Día {idx + 1}</h4>
            <div className="text-small">
              L1: {cantA} | L2: {cantB} | L3: {cantC} | L4: {cantD}
            </div>
            <p style={{ fontWeight: 'bold', marginTop: '5px' }}>Total: {totalDia} registros</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmsRepartidorTriple;