import React from 'react';
import {AbsoluteFill, spring, useVideoConfig} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Caption} from '../ui/Caption';
import {Kicker, Rule} from '../ui/Stat';
import {C, F, clamp} from '../theme';
import type {Act} from '../timeline';
import {mix, useLocal} from '../ui/anim';

const PX = 470;
const secToPx = (s: number) => (s / 300) * PX;

const Panel: React.FC<{x: number; heads: number; each: number; total: string; accent: string; title: string; local: number; morph: number; index: number}> = ({
  x, heads, each, total, accent, title, local, morph, index,
}) => {
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: x, top: 540, width: 560}}>
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: 560}}>
        <div style={{fontFamily: F.mono, fontSize: 25, letterSpacing: '0.26em', color: C.steel}}>{title}</div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 62, color: accent, letterSpacing: '-0.02em',
          textDecoration: local > 4.9 ? 'line-through' : 'none', textDecorationColor: `${C.coral}cc`, textDecorationThickness: 6, opacity: 1 - morph * 0.4}}>
          {heads} ORANG
        </div>
      </div>
      <Rule left={0} top={92} width={560} color="rgba(244,241,234,0.14)" />
      <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24}}>
        {Array.from({length: heads}).map((_, i) => {
          const s = spring({frame: (local - 0.05 - index * 0.09 - i * 0.05) * fps, fps, config: {damping: 24, mass: 0.55, stiffness: 220}});
          const w = mix(112, secToPx(each) * 0.9 + 14, clamp(morph, 0, 1));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: clamp(s * 1.4, 0, 1)}}>
              <div style={{width: Math.max(16, w * s), height: morph > 0.5 ? 78 : 96, borderRadius: 10,
                background: `linear-gradient(90deg, ${accent}, ${accent}66)`, boxShadow: `0 0 34px ${accent}33`}} />
              <div style={{fontFamily: F.mono, fontSize: 24, color: accent, opacity: clamp((morph - 0.45) * 3, 0, 1), letterSpacing: '0.06em'}}>
                {each >= 60 ? `${Math.round(each / 60)}:00` : `0:${String(each).padStart(2, '0')}`}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 700, display: 'flex', alignItems: 'baseline', gap: 14, opacity: clamp((morph - 0.3) * 3, 0, 1)}}>
        <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.24em', color: C.dim}}>TOTAL</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 112, color: accent, letterSpacing: '-0.03em'}}>{total}</div>
      </div>
    </div>
  );
};

export const Act3: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const morph = clamp((t - 4.98) / 1.1, 0, 1);
  const squeeze = clamp((t - 11.1) / 0.7, 0, 1);
  const finale = clamp((t - 11.25) / 0.6, 0, 1);
  return (
    <AbsoluteFill>
      <Backdrop warm={0.7} cool={0.55} />
      <Kicker left={96} top={312} size={26} color={C.steel}>SKALA WAKTU · SATU GARIS = SATU ORANG</Kicker>
      <Rule left={96} top={366} width={1248} color="rgba(244,241,234,0.12)" />
      <AbsoluteFill style={{opacity: 1 - squeeze, transform: `translateY(${-90 * squeeze}px)`}}>
        <Panel x={96} heads={3} each={300} total="15:00" accent={C.coral} title="LOKET KIRI" local={t} morph={morph} index={0} />
        <Panel x={784} heads={5} each={5} total="00:25" accent={C.mint} title="LOKET KANAN" local={t} morph={morph} index={1} />
      </AbsoluteFill>

      <AbsoluteFill style={{opacity: finale}}>
        <div style={{position: 'absolute', left: 96, top: 880, fontFamily: F.display, fontWeight: 800, fontSize: 140, color: C.ink, letterSpacing: '-0.04em', lineHeight: 0.98}}>
          BUKAN ORANG.
        </div>
        <div style={{position: 'absolute', left: 96, top: 1060, fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 210, color: C.amber, lineHeight: 1, textShadow: `0 0 70px ${C.amber}44`}}>
          detik.
        </div>
        <div style={{position: 'absolute', left: 100, top: 1340, fontFamily: F.mono, fontSize: 26, letterSpacing: '0.26em', color: C.steel}}>
          Σ WAKTU LAYANAN — BUKAN Σ KEPALA
        </div>
        <div style={{position: 'absolute', left: 96, top: 1440, display: 'flex', gap: 20}}>
          {[{n: '3 ORANG', v: '15:00', c: C.coral}, {n: '5 ORANG', v: '00:25', c: C.mint}].map((b, i) => (
            <div key={i} style={{width: 286, padding: '20px 24px', borderRadius: 16, border: `2px solid ${b.c}66`, background: 'rgba(10,12,17,0.6)'}}>
              <div style={{fontFamily: F.mono, fontSize: 21, letterSpacing: '0.2em', color: C.dim}}>{b.n}</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 66, color: b.c, letterSpacing: '-0.03em'}}>{b.v}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
