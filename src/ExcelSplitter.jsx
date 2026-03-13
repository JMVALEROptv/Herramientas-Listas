import React, { useState, useMemo } from 'react';
import JSZip from 'jszip'; // Importante: Instalar con npm install jszip

function ExcelSplitter() {
  const [inputText, setInputText] = useState('');
  const [numPartes, setNumPartes] = useState(3);
  const [baseFileName, setBaseFileName] = useState('Datos_Divididos');
  const [isZipping, setIsZipping] = useState(false);

  const procesarLinea = (linea) => {
    return linea.split('\t').join(';');
  };

  const excelData = useMemo(() => {
    if (!inputText.trim()) return { header: '', rows: [] };
    const lines = inputText.split(/\r?\n/).filter(line => line.trim() !== '');
    return {
      header: procesarLinea(lines[0]),
      rows: lines.slice(1).map(procesarLinea)
    };
  }, [inputText]);

  const splitExcel = useMemo(() => {
    const { header, rows } = excelData;
    if (rows.length === 0) return [];
    const size = Math.ceil(rows.length / numPartes);
    const result = [];
    for (let i = 0; i < rows.length; i += size) {
      const chunk = [header, ...rows.slice(i, i + size)].join('\n');
      result.push(chunk);
    }
    return result;
  }, [excelData, numPartes]);

  const BOM = '\uFEFF';

  // Descarga individual
  const downloadFile = (content, index) => {
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const finalName = baseFileName.trim() || 'Datos_Divididos';
    link.href = url;
    link.setAttribute('download', `${finalName}_Parte_${index + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // NUEVA FUNCIÓN: DESCARGAR TODO EN UN ZIP
  const downloadAllAsZip = async () => {
    if (splitExcel.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    const folderName = baseFileName.trim() || 'Datos_Divididos';
    
    // Creamos una carpeta dentro del ZIP
    const folder = zip.folder(folderName);

    splitExcel.forEach((content, idx) => {
      // Añadimos cada archivo al ZIP (incluyendo el BOM para Excel)
      folder.file(`${folderName}_Parte_${idx + 1}.csv`, BOM + content);
    });

    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${folderName}_Completo.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generando el ZIP:", error);
      alert("Hubo un error al generar el archivo comprimido.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="tool-section">
      <div className="card-result" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Nombre base del archivo:</label>
          <input 
            type="text" 
            value={baseFileName} 
            onChange={(e) => setBaseFileName(e.target.value)} 
            placeholder="Ej: Leads_Inmobiliaria"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}
          />
        </div>

        <label>Pega datos de Excel:</label>
        <textarea 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          placeholder="Ctrl+V aquí..."
          rows="6"
        />

        <div className="flex-row" style={{ marginTop: '15px', alignItems: 'center' }}>
          <div style={{ width: '180px' }}>
            <label>Nº de partes:</label>
            <input 
              type="number" 
              value={numPartes} 
              onChange={(e) => setNumPartes(Math.max(1, parseInt(e.target.value) || 1))} 
            />
          </div>
          <div className="flex-1" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <button 
              className="btn btn-primary" 
              onClick={downloadAllAsZip}
              disabled={splitExcel.length === 0 || isZipping}
              style={{ backgroundColor: 'var(--success)', border: 'none' }}
            >
              {isZipping ? 'Generando...' : `📦 Descargar los ${splitExcel.length} bloques (.zip)`}
            </button>
          </div>
        </div>
      </div>

      <div className="grid-results">
        {splitExcel.map((chunk, idx) => (
          <div key={idx} className="card-result">
            <h4 style={{ margin: '0 0 10px 0' }}>Bloque {idx + 1}</h4>
            <p className="text-small">Registros: {chunk.split('\n').length - 1}</p>
            <button className="btn btn-outline" onClick={() => downloadFile(chunk, idx)}>
              Descargar este
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExcelSplitter;