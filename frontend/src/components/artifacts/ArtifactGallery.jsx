import React from 'react';
import { useApp } from '../../context/AppContext';
import ImagePreview from './ImagePreview';
import DocumentPreview from './DocumentPreview';
import EmptyState from '../common/EmptyState';
import { Layers, FileImage, FileText, CheckCircle2, ShieldCheck, Download, ChevronRight } from 'lucide-react';

export default function ArtifactGallery() {
  const {
    artifacts,
    selectedArtifact,
    setSelectedArtifact,
    setActiveTab,
    isDemoMode,
  } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Intro Box */}
      <div
        style={{
          padding: '12px 14px',
          backgroundColor: 'var(--mira-surface)',
          border: '1px solid var(--mira-surface-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: 'var(--mira-text-secondary)',
          lineHeight: '1.45',
        }}
      >
        <strong>Verified Deliverables:</strong> MIRA never marks a task completed based on text alone. Every output file generated on your Windows workstation is cryptographic-hash verified and structural-parsed before delivery.
      </div>

      {artifacts.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={isDemoMode ? "No artifacts found" : "No verified artifacts yet"}
          description={
            isDemoMode
              ? "All demo outputs have been cleared. Submit a new poster or document task in the Assistant tab."
              : "When your Windows laptop finishes compiling files (like vector SVG posters, PDFs, or telemetry reports), verified assets will be delivered here."
          }
          actionLabel="Request Asset in Assistant"
          onAction={() => setActiveTab('assistant')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {artifacts.map((art) => {
            const isSvg = art.content_type === 'image/svg+xml';
            const Icon = isSvg ? FileImage : FileText;

            return (
              <div
                key={art.artifact_id}
                onClick={() => setSelectedArtifact(art)}
                className="card card-interactive"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--mira-champagne-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--mira-bronze-dark)',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
                        {art.filename}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)' }}>
                        {(art.byte_size / 1024).toFixed(1)} KB • {art.content_type.split('/')[1]?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-success" style={{ fontSize: '10.5px' }}>
                    <CheckCircle2 size={11} />
                    <span>Verified</span>
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--mira-surface-secondary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '6px 8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: 'var(--mira-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  SHA-256: {art.sha256_hash.slice(0, 16)}...{art.sha256_hash.slice(-8)}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--mira-surface-secondary)',
                    paddingTop: '8px',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ color: 'var(--mira-text-muted)' }}>
                    {new Date(art.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <span style={{ fontWeight: '600', color: 'var(--mira-bronze)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>Inspect</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Artifact Preview Modals */}
      {selectedArtifact && selectedArtifact.content_type === 'image/svg+xml' && (
        <ImagePreview artifact={selectedArtifact} onClose={() => setSelectedArtifact(null)} />
      )}

      {selectedArtifact && selectedArtifact.content_type !== 'image/svg+xml' && (
        <DocumentPreview artifact={selectedArtifact} onClose={() => setSelectedArtifact(null)} />
      )}
    </div>
  );
}
