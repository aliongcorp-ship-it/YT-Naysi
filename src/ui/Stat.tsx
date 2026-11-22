import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';

export const Kicker: React.FC<{children: React.ReactNode; color?: string; left?: number; top?: number; size?: number; opacity?: number}> = ({
  children, color = C.dim, left, top, size = 26, opacity = 1,
}) => (
  <div style={{position: 'absolute', left, top, fontFamily: F.mono, fontSize: size, letterSpacing: '0.3em', color, opacity, whiteSpace: 'nowrap'}}>{children}</div>
);

export const Rule: React.FC<{left: number; top: number; width: number; color?: string; opacity?: number; thick?: number}> = ({left, top, width, color = C.faint, opacity = 1, thick = 2}) => (
  <div style={{position: 'absolute', left, top, width, height: thick, background: color, opacity}} />
);

export const BigNumber: React.FC<{
  value: number; left: number; top: number; size?: number; color?: string; decimals?: number;
  suffix?: string; enter?: number; punch?: number;
}> = ({value, left, top, size = 320, color = C.amber, decimals = 0, suffix, enter = 0, punch = 0}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({frame: frame - enter * fps, fps, config: {damping: 26, mass: 0.6, stiffness: 160}});
  const shown = value.toFixed(decimals).replace('.', ',');
  return (
    <div
      style={{
        position: 'absolute', left, top, fontFamily: F.mono, fontWeight: 700, fontSize: size, lineHeight: 1,
        color, letterSpacing: '-0.05em', transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${1 + punch * 0.02})`,
        opacity: s, filter: `drop-shadow(0 0 ${60 + punch * 40}px ${color}55)`, display: 'flex', alignItems: 'baseline',
      }}
    >
      <span style={{fontVariantNumeric: 'tabular-nums'}}>{shown}</span>
      {suffix ? <span style={{fontSize: size * 0.34, marginLeft: size * 0.05, color, opacity: 0.8, letterSpacing: '0'}}>{suffix}</span> : null}
    </div>
  );
};

type Seg = {text: string; em?: boolean; color?: string};

export const Statement: React.FC<{
  lines: Seg[][]; left: number; top: number; size?: number; enter?: number; lineGap?: number; weight?: number; upper?: boolean; width?: number;
}> = ({lines, left, top, size = 96, enter = 0, lineGap = 1.02, weight = 800, upper = true, width}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left, top, width, fontFamily: F.display, fontWeight: weight, fontSize: size, lineHeight: lineGap, letterSpacing: '-0.03em', textShadow: '0 10px 50px rgba(0,0,0,0.6)'}}>
      {lines.map((line, i) => {
        const s = spring({frame: frame - (enter + i * 0.09) * fps, fps, config: {damping: 24, mass: 0.6, stiffness: 200}});
        return (
          <div key={i} style={{overflow: 'hidden'}}>
            <div style={{transform: `translateY(${interpolate(s, [0, 1], [size * 1.05, 0])}px)`}}>
              {line.map((seg, j) => (
                <span
                  key={j}
                  style={
                    seg.em
                      ? {fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, color: seg.color ?? C.amber, letterSpacing: '0', fontSize: size * 1.06}
                      : {color: seg.color ?? C.ink, textTransform: upper ? 'uppercase' : 'none'}
                  }
                >
                  {seg.text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{children: React.ReactNode; left?: number; top?: number; color?: string; size?: number; filled?: boolean; right?: number; bottom?: number}> = ({
  children, left, top, color = C.dim, size = 24, filled = false, right, bottom,
}) => (
  <div
    style={{
      position: 'absolute', left, top, right, bottom, padding: `${size * 0.5}px ${size * 0.95}px`, borderRadius: 999,
      border: `2px solid ${filled ? 'transparent' : color + '77'}`, background: filled ? color : 'rgba(10,12,17,0.7)',
      color: filled ? '#0A0C11' : color, fontFamily: F.mono, fontSize: size, letterSpacing: '0.24em', whiteSpace: 'nowrap',
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

export const ProgressDots: React.FC<{n: number; active: number; left: number; top: number; gap?: number; size?: number; color?: string}> = ({
  n, active, left, top, gap = 22, size = 12, color = C.amber,
}) => (
  <div style={{position: 'absolute', left, top, display: 'flex', gap}}>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{width: size, height: size, borderRadius: size, background: i <= active ? color : 'rgba(244,241,234,0.18)', boxShadow: i === active ? `0 0 18px ${color}` : undefined}} />
    ))}
  </div>
);
