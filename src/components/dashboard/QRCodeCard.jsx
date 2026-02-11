import { QRCodeSVG } from 'qrcode.react';
import { useUI } from '../../contexts/UIContext';
import './QRCodeCard.css';

const QRCodeCard = () => {
  const { menuUrl, primaryColor } = useUI();

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'menu-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    window.print();
  };

  return (
    <div className="qr-code-card">
      <div className="qr-section">
        <div className="qr-container">
          <QRCodeSVG
            id="qr-code-svg"
            value={menuUrl}
            size={280}
            level="H"
            includeMargin={true}
            fgColor={primaryColor}
          />
        </div>
        
        <div className="qr-info">
          <h3>Escanea para ver el menú</h3>
          <p className="qr-url">{menuUrl}</p>
        </div>
      </div>

      <div className="qr-actions">
        <button onClick={downloadQR} className="qr-btn qr-btn-primary">
          <span>⬇️</span>
          Descargar QR
        </button>
        <button onClick={printQR} className="qr-btn qr-btn-secondary">
          <span>🖨️</span>
          Imprimir
        </button>
      </div>

      <div className="qr-tips">
        <h4>💡 Consejos de uso:</h4>
        <ul>
          <li>Imprime el QR en alta calidad para las mesas</li>
          <li>Asegúrate que esté visible y accesible</li>
          <li>Puedes colocar múltiples copias en diferentes áreas</li>
          <li>El QR siempre mostrará tu menú actualizado</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeCard;
