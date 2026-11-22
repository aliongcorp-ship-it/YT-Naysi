import React from 'react';
import {C, F} from '../theme';

export type Accent = 'amber' | 'coral' | 'mint' | 'ink';
const accentColor = (a: Accent) => (a === 'amber' ? C.amber : a === 'coral' ? C.coral : a === 'mint' ? C.mint : C.ink);

const Person: React.FC<{accent: Accent; dim: number; w?: number; h?: number}> = ({accent, dim, w = 150, h = 168}) => {
  const col = accentColor(accent);
  return (
    <div style={{width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', opacity: dim}}>
      <div style={{width: w * 0.27, height: w * 0.27, borderRadius: '50%', background: `radial-gradient(circle at 36% 32%, #fff6, ${col})`, boxShadow: `0 0 26px ${col}44, inset 0 -4px 10px rgba(0,0,0,0.35)`}} />
      <div
        style={{
          width: w * 0.72,
          height: h * 0.42,
          marginTop: h * 0.045,
          borderRadius: `${w * 0.26}px ${w * 0.26}px ${w * 0.08}px ${w * 0.08}px`,
          background: `linear-gradient(175deg, ${col}ee 0%, ${col}bb 55%, ${col}77 100%)`,
          boxShadow: `inset 0 6px 14px rgba(255,255,255,0.18), inset 0 -8px 16px rgba(0,0,0,0.3)`,
        }}
      />
    </div>
  );
};

export const Lane: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  accent: Accent;
  label: string;
  count: number;
  scroll: number;
  scale?: number;
  focus?: number;
  youIndex?: number | null;
  you?: {label: string; glow: number};
  dim?: number;
  step?: number;
  sublabel?: string;
}> = ({x, y, width = 320, height = 1040, accent, label, count, scroll, scale = 1, focus = 0, youIndex = null, you, dim = 1, step = 172, sublabel}) => {
  const col = accentColor(accent);
  const inner = height - 40;
  return (
    <div style={{position: 'absolute', left: x, top: y, width, height, transform: `scale(${scale})`, transformOrigin: 'bottom center'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 32,
          border: `2px solid ${focus > 0 ? col : 'rgba(244,241,234,0.16)'}`,
          background: 'linear-gradient(180deg, rgba(17,21,29,0.9), rgba(9,11,16,0.96))',
          boxShadow: focus > 0 ? `0 0 ${60 * focus}px ${col}44, inset 0 0 90px rgba(0,0,0,0.6)` : 'inset 0 0 90px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          opacity: 0.35 + 0.65 * dim,
        }}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: col, opacity: 0.8}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontFamily: F.mono, fontSize: 24, letterSpacing: '0.28em', color: col, opacity: 0.95}}>{label}</div>
        {sublabel ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontFamily: F.mono, fontSize: 28, color: C.dim}}>{sublabel}</div>
        ) : null}
        <div style={{position: 'absolute', left: 0, right: 0, top: 96, bottom: 0, overflow: 'hidden'}}>
          {Array.from({length: count + 2}).map((_, k) => {
            const pos = (k + scroll) * step;
            const bottom = 24 + pos;
            const opacity = bottom > inner - 40 ? Math.max(0, 1 - (bottom - (inner - 40)) / 90) : 1;
            const isYou = youIndex === k;
            if (opacity <= 0.01) return null;
            if (isYou && you) {
              return (
                <div key={k} style={{position: 'absolute', left: 0, right: 0, bottom: bottom - 18, display: 'flex', justifyContent: 'center', opacity}}>
                  <div style={{position: 'relative'}}>
                    <div style={{position: 'absolute', inset: -22, borderRadius: 40, background: `${C.amber}22`, boxShadow: `0 0 ${60 * you.glow}px ${C.amber}66`}} />
                    <div style={{padding: '20px 34px', borderRadius: 26, background: `linear-gradient(180deg, ${C.amber}, #E8A22F)`, color: '#1A1305', fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: '0.16em', boxShadow: '0 18px 50px rgba(0,0,0,0.6)'}}>
                      {you.label}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={k} style={{position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center', opacity}}>
                <Person accent={accent} dim={0.55 + 0.45 * dim} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
