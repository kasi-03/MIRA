import React from 'react';
import { Download } from 'lucide-react';

export default function DownloadButton({ filename, content, contentType = 'text/plain', label = 'Download' }) {
  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="btn btn-secondary btn-sm"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      title={`Download ${filename}`}
    >
      <Download size={14} />
      <span>{label}</span>
    </button>
  );
}
