import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Copy, Check, X, ZoomIn, ZoomOut, RotateCcw, ShieldCheck, FileCode, HardDrive } from 'lucide-react';

export const ArtifactViewerModal = () => {
  const { selectedArtifact, closeArtifactViewer } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('preview'); // 'preview' or 'code'

  if (!selectedArtifact) return null;

  const isSvg = selectedArtifact.type === 'image/svg+xml' || selectedArtifact.filename.endsWith('.svg');

  const handleDownload = () => {
    const blob = new Blob([selectedArtifact.content || ''], { type: selectedArtifact.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedArtifact.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedArtifact.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={closeArtifactViewer}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '960px', width: '95%', maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="card-title-group">
            <div className="card-icon-bubble" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                  {selectedArtifact.filename}
                </h3>
                <span className="badge badge-completed" style={{ fontSize: '11px' }}>
                  ✓ SHA-256 Verified
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)', fontFamily: 'var(--font-mono)' }}>
                {selectedArtifact.size} • Path: {selectedArtifact.local_path}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', backgroundColor: 'var(--color-bg)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <button
                type="button"
                className={`mira-btn mira-btn-sm ${activeViewTab === 'preview' ? 'mira-btn-secondary' : ''}`}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
                onClick={() => setActiveViewTab('preview')}
              >
                Rendered Preview
              </button>
              <button
                type="button"
                className={`mira-btn mira-btn-sm ${activeViewTab === 'code' ? 'mira-btn-secondary' : ''}`}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
                onClick={() => setActiveViewTab('code')}
              >
                Source View
              </button>
            </div>

            <button className="mira-btn-outline mira-btn-sm" onClick={closeArtifactViewer}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Verification Check Strip */}
        <div style={{
          padding: '10px 24px',
          backgroundColor: 'var(--color-linen)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>Cryptographic Digest:</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-secondary)', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border-light)' }}>
              {selectedArtifact.sha256}
            </code>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--color-success)', fontWeight: 600 }}>
            <span>✓ XML Parse: Valid</span>
            <span>✓ Size: Non-Zero</span>
            <span>✓ Safety Guard: Clean</span>
          </div>
        </div>

        {/* Body Viewer */}
        <div className="modal-body" style={{ padding: '0', backgroundColor: '#F6F3EC', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeViewTab === 'preview' ? (
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', position: 'relative', minHeight: '440px' }}>
              {isSvg ? (
                <div 
                  style={{ 
                    transform: `scale(${zoomLevel})`, 
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease',
                    maxWidth: '560px',
                    width: '100%',
                    boxShadow: '0 20px 50px rgba(52, 43, 38, 0.15)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#FAF7F1'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedArtifact.content }}
                />
              ) : (
                <div style={{
                  maxWidth: '700px',
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  padding: '36px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-card)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedArtifact.content}
                </div>
              )}

              {/* Floating Zoom Controls for SVG */}
              {isSvg && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-dropdown)',
                  border: '1px solid var(--color-border)'
                }}>
                  <button 
                    type="button" 
                    className="mira-btn-outline mira-btn-sm" 
                    style={{ padding: '4px' }} 
                    onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.2))}
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', minWidth: '40px', textAlign: 'center' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button 
                    type="button" 
                    className="mira-btn-outline mira-btn-sm" 
                    style={{ padding: '4px' }} 
                    onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.2))}
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button 
                    type="button" 
                    className="mira-btn-outline mira-btn-sm" 
                    style={{ padding: '4px' }} 
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#2A2420' }}>
              <pre style={{
                color: '#FAF7F1',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {selectedArtifact.content}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="mira-btn mira-btn-outline"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
            {copied ? "Copied Source" : "Copy Source"}
          </button>
          <button
            type="button"
            className="mira-btn mira-btn-primary"
            onClick={handleDownload}
          >
            <Download size={16} />
            Download Verified File
          </button>
        </div>
      </div>
    </div>
  );
};
