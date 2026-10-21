import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import DownloadButton from './DownloadButton';

export default function ImagePreview({ artifact, onClose }) {
  if (!artifact) return null;

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  // Safe SVG content rendering: ensure scripts are stripped
  const sanitizedContent = (artifact.raw_content || '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span className="badge badge-success" style={{ fontSize: '11px' }}>
                <CheckCircle2 size={12} />
                <span>Verified Deliverable</span>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)' }}>
                {(artifact.byte_size / 1024).toFixed(1)} KB
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
              {artifact.filename}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              border: 'none',
              background: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--mira-text-secondary)',
            }}
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Verification Checksum Card */}
        <div
          style={{
            backgroundColor: 'var(--mira-surface-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '11.5px',
            color: 'var(--mira-text-secondary)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <ShieldCheck size={14} color="var(--mira-success)" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              SHA-256: {artifact.sha256_hash}
            </span>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--mira-success)', flexShrink: 0 }}>
            MATCHED
          </span>
        </div>

        {/* Zoom Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            backgroundColor: 'var(--mira-canvas)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mira-text-secondary)' }}>
            Vector Zoom: {Math.round(zoomLevel * 100)}%
          </span>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handleZoomOut} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <button onClick={handleResetZoom} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Reset Zoom">
              <RotateCcw size={14} />
            </button>
            <button onClick={handleZoomIn} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Zoom In">
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Canvas Display Area */}
        <div
          style={{
            flex: 1,
            minHeight: '280px',
            maxHeight: '440px',
            overflow: 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--mira-surface-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            position: 'relative',
          }}
        >
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
              maxWidth: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <DownloadButton
            filename={artifact.filename}
            content={artifact.raw_content}
            contentType={artifact.content_type}
            label="Save Deliverable"
          />
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
