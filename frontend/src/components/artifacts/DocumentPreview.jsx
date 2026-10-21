import React from 'react';
import { X, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';
import DownloadButton from './DownloadButton';

export default function DocumentPreview({ artifact, onClose }) {
  if (!artifact) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '85vh' }} onClick={(e) => e.stopPropagation()}>
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

        {/* Checksum Badge */}
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
            gap: '8px',
          }}
        >
          <ShieldCheck size={14} color="var(--mira-success)" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            SHA-256: {artifact.sha256_hash}
          </span>
        </div>

        {/* Text Preview Display */}
        <pre
          style={{
            flex: 1,
            minHeight: '200px',
            maxHeight: '380px',
            overflowY: 'auto',
            backgroundColor: 'var(--mira-surface)',
            border: '1px solid var(--mira-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '13px',
            fontFamily: 'monospace',
            color: 'var(--mira-text-primary)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}
        >
          {artifact.raw_content || 'No content available'}
        </pre>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <DownloadButton
            filename={artifact.filename}
            content={artifact.raw_content}
            contentType={artifact.content_type}
            label="Download File"
          />
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
