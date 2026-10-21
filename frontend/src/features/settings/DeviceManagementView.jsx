import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Laptop,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Copy,
  ExternalLink,
  Wifi,
  Radio,
  Globe,
  ArrowLeft
} from 'lucide-react';

// Exact SVG QR Code Path for http://10.73.211.112:3000 (Current Hotspot IP)
const QR_PATH_HOTSPOT = "M16,16h8v8h-8z M24,16h8v8h-8z M32,16h8v8h-8z M40,16h8v8h-8z M48,16h8v8h-8z M56,16h8v8h-8z M64,16h8v8h-8z M80,16h8v8h-8z M88,16h8v8h-8z M112,16h8v8h-8z M144,16h8v8h-8z M160,16h8v8h-8z M168,16h8v8h-8z M176,16h8v8h-8z M184,16h8v8h-8z M192,16h8v8h-8z M200,16h8v8h-8z M208,16h8v8h-8z M16,24h8v8h-8z M64,24h8v8h-8z M88,24h8v8h-8z M104,24h8v8h-8z M112,24h8v8h-8z M120,24h8v8h-8z M128,24h8v8h-8z M136,24h8v8h-8z M144,24h8v8h-8z M160,24h8v8h-8z M208,24h8v8h-8z M16,32h8v8h-8z M32,32h8v8h-8z M40,32h8v8h-8z M48,32h8v8h-8z M64,32h8v8h-8z M80,32h8v8h-8z M88,32h8v8h-8z M96,32h8v8h-8z M104,32h8v8h-8z M120,32h8v8h-8z M160,32h8v8h-8z M176,32h8v8h-8z M184,32h8v8h-8z M192,32h8v8h-8z M208,32h8v8h-8z M16,40h8v8h-8z M32,40h8v8h-8z M40,40h8v8h-8z M48,40h8v8h-8z M64,40h8v8h-8z M96,40h8v8h-8z M136,40h8v8h-8z M144,40h8v8h-8z M160,40h8v8h-8z M176,40h8v8h-8z M184,40h8v8h-8z M192,40h8v8h-8z M208,40h8v8h-8z M16,48h8v8h-8z M32,48h8v8h-8z M40,48h8v8h-8z M48,48h8v8h-8z M64,48h8v8h-8z M96,48h8v8h-8z M120,48h8v8h-8z M128,48h8v8h-8z M160,48h8v8h-8z M176,48h8v8h-8z M184,48h8v8h-8z M192,48h8v8h-8z M208,48h8v8h-8z M16,56h8v8h-8z M64,56h8v8h-8z M80,56h8v8h-8z M96,56h8v8h-8z M104,56h8v8h-8z M112,56h8v8h-8z M144,56h8v8h-8z M160,56h8v8h-8z M208,56h8v8h-8z M16,64h8v8h-8z M24,64h8v8h-8z M32,64h8v8h-8z M40,64h8v8h-8z M48,64h8v8h-8z M56,64h8v8h-8z M64,64h8v8h-8z M80,64h8v8h-8z M96,64h8v8h-8z M112,64h8v8h-8z M128,64h8v8h-8z M144,64h8v8h-8z M160,64h8v8h-8z M168,64h8v8h-8z M176,64h8v8h-8z M184,64h8v8h-8z M192,64h8v8h-8z M200,64h8v8h-8z M208,64h8v8h-8z M104,72h8v8h-8z M16,80h8v8h-8z M32,80h8v8h-8z M64,80h8v8h-8z M72,80h8v8h-8z M88,80h8v8h-8z M120,80h8v8h-8z M128,80h8v8h-8z M136,80h8v8h-8z M144,80h8v8h-8z M168,80h8v8h-8z M192,80h8v8h-8z M208,80h8v8h-8z M24,88h8v8h-8z M40,88h8v8h-8z M48,88h8v8h-8z M56,88h8v8h-8z M72,88h8v8h-8z M88,88h8v8h-8z M104,88h8v8h-8z M112,88h8v8h-8z M144,88h8v8h-8z M160,88h8v8h-8z M176,88h8v8h-8z M184,88h8v8h-8z M200,88h8v8h-8z M208,88h8v8h-8z M32,96h8v8h-8z M40,96h8v8h-8z M64,96h8v8h-8z M80,96h8v8h-8z M88,96h8v8h-8z M96,96h8v8h-8z M104,96h8v8h-8z M120,96h8v8h-8z M128,96h8v8h-8z M144,96h8v8h-8z M152,96h8v8h-8z M168,96h8v8h-8z M176,96h8v8h-8z M184,96h8v8h-8z M192,96h8v8h-8z M208,96h8v8h-8z M16,104h8v8h-8z M24,104h8v8h-8z M72,104h8v8h-8z M88,104h8v8h-8z M96,104h8v8h-8z M104,104h8v8h-8z M112,104h8v8h-8z M184,104h8v8h-8z M16,112h8v8h-8z M24,112h8v8h-8z M32,112h8v8h-8z M40,112h8v8h-8z M48,112h8v8h-8z M64,112h8v8h-8z M88,112h8v8h-8z M96,112h8v8h-8z M112,112h8v8h-8z M120,112h8v8h-8z M128,112h8v8h-8z M152,112h8v8h-8z M168,112h8v8h-8z M176,112h8v8h-8z M208,112h8v8h-8z M40,120h8v8h-8z M48,120h8v8h-8z M72,120h8v8h-8z M112,120h8v8h-8z M144,120h8v8h-8z M152,120h8v8h-8z M200,120h8v8h-8z M208,120h8v8h-8z M16,128h8v8h-8z M24,128h8v8h-8z M32,128h8v8h-8z M40,128h8v8h-8z M48,128h8v8h-8z M56,128h8v8h-8z M64,128h8v8h-8z M80,128h8v8h-8z M88,128h8v8h-8z M112,128h8v8h-8z M120,128h8v8h-8z M128,128h8v8h-8z M168,128h8v8h-8z M184,128h8v8h-8z M192,128h8v8h-8z M208,128h8v8h-8z M32,136h8v8h-8z M40,136h8v8h-8z M96,136h8v8h-8z M104,136h8v8h-8z M112,136h8v8h-8z M144,136h8v8h-8z M152,136h8v8h-8z M160,136h8v8h-8z M16,144h8v8h-8z M24,144h8v8h-8z M32,144h8v8h-8z M40,144h8v8h-8z M56,144h8v8h-8z M64,144h8v8h-8z M72,144h8v8h-8z M88,144h8v8h-8z M120,144h8v8h-8z M128,144h8v8h-8z M144,144h8v8h-8z M152,144h8v8h-8z M160,144h8v8h-8z M168,144h8v8h-8z M176,144h8v8h-8z M184,144h8v8h-8z M200,144h8v8h-8z M80,152h8v8h-8z M88,152h8v8h-8z M96,152h8v8h-8z M120,152h8v8h-8z M136,152h8v8h-8z M144,152h8v8h-8z M176,152h8v8h-8z M208,152h8v8h-8z M16,160h8v8h-8z M24,160h8v8h-8z M32,160h8v8h-8z M40,160h8v8h-8z M48,160h8v8h-8z M56,160h8v8h-8z M64,160h8v8h-8z M80,160h8v8h-8z M88,160h8v8h-8z M104,160h8v8h-8z M136,160h8v8h-8z M144,160h8v8h-8z M160,160h8v8h-8z M176,160h8v8h-8z M184,160h8v8h-8z M192,160h8v8h-8z M208,160h8v8h-8z M16,168h8v8h-8z M64,168h8v8h-8z M120,168h8v8h-8z M136,168h8v8h-8z M144,168h8v8h-8z M176,168h8v8h-8z M192,168h8v8h-8z M16,176h8v8h-8z M32,176h8v8h-8z M40,176h8v8h-8z M48,176h8v8h-8z M64,176h8v8h-8z M88,176h8v8h-8z M96,176h8v8h-8z M104,176h8v8h-8z M112,176h8v8h-8z M120,176h8v8h-8z M136,176h8v8h-8z M144,176h8v8h-8z M152,176h8v8h-8z M160,176h8v8h-8z M168,176h8v8h-8z M176,176h8v8h-8z M184,176h8v8h-8z M208,176h8v8h-8z M16,184h8v8h-8z M32,184h8v8h-8z M40,184h8v8h-8z M48,184h8v8h-8z M64,184h8v8h-8z M88,184h8v8h-8z M96,184h8v8h-8z M112,184h8v8h-8z M152,184h8v8h-8z M168,184h8v8h-8z M176,184h8v8h-8z M184,184h8v8h-8z M192,184h8v8h-8z M16,192h8v8h-8z M32,192h8v8h-8z M40,192h8v8h-8z M48,192h8v8h-8z M64,192h8v8h-8z M80,192h8v8h-8z M96,192h8v8h-8z M112,192h8v8h-8z M120,192h8v8h-8z M128,192h8v8h-8z M136,192h8v8h-8z M144,192h8v8h-8z M200,192h8v8h-8z M208,192h8v8h-8z M16,200h8v8h-8z M64,200h8v8h-8z M88,200h8v8h-8z M96,200h8v8h-8z M104,200h8v8h-8z M112,200h8v8h-8z M128,200h8v8h-8z M152,200h8v8h-8z M168,200h8v8h-8z M176,200h8v8h-8z M184,200h8v8h-8z M192,200h8v8h-8z M16,208h8v8h-8z M24,208h8v8h-8z M32,208h8v8h-8z M40,208h8v8h-8z M48,208h8v8h-8z M56,208h8v8h-8z M64,208h8v8h-8z M80,208h8v8h-8z M88,208h8v8h-8z M120,208h8v8h-8z M128,208h8v8h-8z M144,208h8v8h-8z M152,208h8v8h-8z M176,208h8v8h-8z M184,208h8v8h-8z M208,208h8v8h-8z";

export default function DeviceManagementView({ onBack }) {
  const { laptopConnection, isDemoMode } = useApp();
  const [probeResult, setProbeResult] = useState(null);
  const [isProbing, setIsProbing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detectedIp, setDetectedIp] = useState('10.73.211.112');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.local_ip) setDetectedIp(data.local_ip);
      })
      .catch(() => {});
  }, []);

  const mobileUrl = `http://${detectedIp}:3000`;

  const copyUrl = () => {
    navigator.clipboard?.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsProbing(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setProbeResult({
          status: 'success',
          latency,
          ip: data.local_ip || detectedIp,
          service: data.service || 'mira-backend',
          agent: data.workstation_agent || 'fastmcp-windows',
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setProbeResult({
          status: 'error',
          error: `HTTP ${res.status}: Backend returned unexpected error`,
        });
      }
    } catch (err) {
      setProbeResult({
        status: 'error',
        error: `Network Unreachable: ${err.message}`,
      });
    } finally {
      setIsProbing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px 0 24px' }}>
      {/* Top Bar with Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{
            alignSelf: 'flex-start',
            padding: '6px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--mira-text-secondary)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Settings</span>
        </button>
      )}

      {/* Hero Pairing Card with Live Scannable QR Code */}
      <div
        className="card"
        style={{
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'var(--mira-surface)',
          border: '1px solid var(--mira-champagne)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--mira-champagne-subtle)',
            color: 'var(--mira-bronze-dark)',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <Radio size={13} className="pulse-dot" />
          <span>Realme Hotspot Pairing Active</span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--mira-text-primary)', marginBottom: '8px' }}>
          Connect Phone to Laptop
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--mira-text-secondary)', maxWidth: '440px', lineHeight: '1.45', margin: '0 auto 18px' }}>
          Your laptop is connected to your phone's hotspot (<code>realme 11x 5G 73</code>). Scan the QR code below or open the URL in your phone's browser:
        </p>

        {/* QR Code Container */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 24px rgba(38, 37, 33, 0.08)',
            border: '2px solid var(--mira-champagne-soft)',
            width: '200px',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 232 232"
            width="100%"
            height="100%"
            style={{ borderRadius: '6px' }}
          >
            <rect width="232" height="232" fill="#FFFFFF" />
            <path d={QR_PATH_HOTSPOT} fill="#262521" />
          </svg>
        </div>

        {/* Live Mobile URL & Copy Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--mira-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            maxWidth: '380px',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--mira-bronze-dark)',
              flex: 1,
              textAlign: 'left',
              userSelect: 'all',
            }}
          >
            {mobileUrl}
          </span>

          <button
            onClick={copyUrl}
            className="btn btn-primary btn-sm"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              minHeight: '32px',
              gap: '4px',
            }}
          >
            {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--mira-text-muted)', lineHeight: '1.4' }}>
          Make sure your phone is running the hotspot <strong>realme 11x 5G 73</strong> that this laptop is connected to.
        </div>
      </div>

      {/* Alternative: Localtunnel Public Access Card */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--mira-surface)',
          borderLeft: '4px solid var(--mira-bronze)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Globe size={16} color="var(--mira-bronze)" />
          <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
            Option B: Localtunnel Public Link
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.4', margin: '0 0 10px' }}>
          If local hotspot routing is blocked, check your terminal running <code>npx localtunnel --port 3000</code>. Open the <code>https://xxxx.loca.lt</code> link on your phone.
        </p>
        <div style={{ fontSize: '12px', backgroundColor: 'var(--mira-surface-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
          <strong>Tunnel Password:</strong> When prompted on your phone, enter your laptop's public IP: <code style={{ fontWeight: '700', color: 'var(--mira-bronze-dark)' }}>157.50.159.23</code> and tap <em>Click to Submit</em>.
        </div>
      </div>

      {/* Tri-Tier Connection Diagnostics */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
              Workstation Network Topology
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--mira-text-muted)' }}>
              Active ports bound across host interfaces
            </span>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isProbing}
            className="btn btn-secondary btn-sm"
            style={{ minHeight: '34px', gap: '6px', fontSize: '12.5px' }}
          >
            <RefreshCw size={13} className={isProbing ? 'spin' : ''} />
            <span>{isProbing ? 'Probing...' : 'Probe Liveness'}</span>
          </button>
        </div>

        {/* Diagnostic Endpoint Tiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--mira-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} color="var(--mira-bronze)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>Mobile Web Client (Vite)</div>
                <div style={{ fontSize: '11.5px', color: 'var(--mira-text-muted)', fontFamily: 'monospace' }}>
                  http://{detectedIp}:3000
                </div>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: '11px' }}>
              Bound 0.0.0.0
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--mira-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="var(--mira-bronze)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>Backend Policy Engine (Flask)</div>
                <div style={{ fontSize: '11.5px', color: 'var(--mira-text-muted)', fontFamily: 'monospace' }}>
                  http://{detectedIp}:5000
                </div>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: '11px' }}>
              Bound 0.0.0.0
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--mira-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Laptop size={16} color="var(--mira-bronze)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>Hardware Execution Host (FastMCP)</div>
                <div style={{ fontSize: '11.5px', color: 'var(--mira-text-muted)', fontFamily: 'monospace' }}>
                  http://127.0.0.1:8000
                </div>
              </div>
            </div>
            <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
              Confined Localhost
            </span>
          </div>
        </div>

        {/* Live Probe Feedback Banner */}
        {probeResult && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: probeResult.status === 'success' ? 'var(--mira-success-bg)' : 'var(--mira-error-bg)',
              border: `1px solid ${probeResult.status === 'success' ? 'var(--mira-success-border)' : 'var(--mira-error-border)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12.5px',
            }}
          >
            {probeResult.status === 'success' ? (
              <>
                <CheckCircle2 size={16} color="var(--mira-success)" />
                <span style={{ color: 'var(--mira-success)' }}>
                  Workstation healthy: Responded in <strong>{probeResult.latency}ms</strong> ({probeResult.agent} on {probeResult.ip}).
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={16} color="var(--mira-error)" />
                <span style={{ color: 'var(--mira-error)' }}>
                  {probeResult.error}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
