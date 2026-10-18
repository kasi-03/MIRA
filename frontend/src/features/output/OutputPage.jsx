import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderCheck, 
  Download, 
  Copy, 
  Eye, 
  FileCode, 
  FileText, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

export const OutputPage = () => {
  const { tasks, openArtifactViewer, openTaskDetails } = useApp();
  const [copiedId, setCopiedId] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'svg', 'markdown'

  const verifiedArtifacts = tasks
    .filter(t => t.artifact)
    .map(t => ({
      ...t.artifact,
      task_title: t.title,
      task_id: t.task_id,
      completed_at: t.completed_at,
      verification: t.verification
    }));

  const filteredArtifacts = verifiedArtifacts.filter(a => {
    if (filterType === 'svg') return a.type.includes('svg');
    if (filterType === 'markdown') return a.type.includes('markdown');
    return true;
  });

  const handleCopyDigest = (digest, id) => {
    navigator.clipboard.writeText(digest);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (artifact) => {
    const blob = new Blob([artifact.content || ''], { type: artifact.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = artifact.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: '1.9rem', marginBottom: '4px' }}>
            Verified Workstation Outputs
          </h1>
          <p style={{ color: 'var(--color-espresso-secondary)', fontSize: '14px' }}>
            Inspect physical artifacts produced by Windows FastMCP tools and verified via cryptographic checksums.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`mira-btn mira-btn-sm ${filterType === 'all' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ fontWeight: filterType === 'all' ? 700 : 500 }}
            onClick={() => setFilterType('all')}
          >
            All Artifacts ({verifiedArtifacts.length})
          </button>
          <button
            type="button"
            className={`mira-btn mira-btn-sm ${filterType === 'svg' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ fontWeight: filterType === 'svg' ? 700 : 500 }}
            onClick={() => setFilterType('svg')}
          >
            Vector SVG Posters
          </button>
          <button
            type="button"
            className={`mira-btn mira-btn-sm ${filterType === 'markdown' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ fontWeight: filterType === 'markdown' ? 700 : 500 }}
            onClick={() => setFilterType('markdown')}
          >
            Technical Briefs
          </button>
        </div>
      </div>

      {/* Artifacts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
        {filteredArtifacts.length === 0 ? (
          <div className="porcelain-card" style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center' }}>
            <FolderCheck size={36} color="var(--color-espresso-faint)" style={{ margin: '0 auto 12px' }} />
            <h3 className="serif-heading" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Verified Outputs Yet</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-espresso-muted)' }}>
              Once tasks complete their execution and cryptographic verification on the workstation, verified outputs will appear here.
            </p>
          </div>
        ) : (
          filteredArtifacts.map(artifact => {
            const isSvg = artifact.type.includes('svg');

            return (
              <div key={artifact.id} className="porcelain-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Card Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="card-icon-bubble" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                      {isSvg ? <FileCode size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-espresso)' }}>
                        {artifact.filename}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                        Associated: {artifact.task_title}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-completed">
                    ✓ Verified
                  </span>
                </div>

                {/* Preview Box */}
                <div 
                  style={{
                    height: '240px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => openArtifactViewer(artifact)}
                >
                  {isSvg ? (
                    <div 
                      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                      dangerouslySetInnerHTML={{ __html: artifact.content }}
                    />
                  ) : (
                    <div style={{ padding: '20px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-secondary)', overflow: 'hidden', height: '100%', width: '100%' }}>
                      {artifact.content}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(52, 43, 38, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    backdropFilter: 'blur(2px)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <button 
                      type="button" 
                      className="mira-btn mira-btn-primary mira-btn-sm"
                      onClick={() => openArtifactViewer(artifact)}
                    >
                      <Eye size={14} />
                      Inspect Artifact
                    </button>
                  </div>
                </div>

                {/* Details Strip */}
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--color-border-light)',
                  fontSize: '11.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '16px',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>MIME Type:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{artifact.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Byte Size:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{artifact.size}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>SHA-256 Digest:</span>
                    <button
                      type="button"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gold-hover)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                      onClick={() => handleCopyDigest(artifact.sha256, artifact.id)}
                    >
                      <span>{artifact.sha256.slice(0, 10)}...</span>
                      {copiedId === artifact.id ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                  <button
                    type="button"
                    className="mira-btn mira-btn-outline mira-btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => openTaskDetails(artifact.task_id)}
                  >
                    <span>View Task Flow</span>
                  </button>

                  <button
                    type="button"
                    className="mira-btn mira-btn-primary mira-btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleDownload(artifact)}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
