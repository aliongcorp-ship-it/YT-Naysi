import React from 'react';
import {AbsoluteFill, spring, useVideoConfig} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Caption} from '../ui/Caption';
import {Kicker, Rule} from '../ui/Stat';
import {C, F, clamp} from '../theme';
import type {Act} from '../timeline';
import {mix, useLocal} from '../ui/anim';

export const Act5: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const {fps} = useVideoConfig();
  const grey = clamp((t - 2.3) / 1.6, 0, 1);
  const lossIn = clamp((t - 6.7) / 0.5, 0, 1);
  const burn = clamp((t - 8.1) / 1.2, 0, 1);
  const statement = clamp((t - 9.1) / 0.5, 0, 1);
  const wound = clamp((t - 11.0) / 0.5, 0, 1);
  const shake = wound > 0 && wound < 1 ? Math.sin(t * 70) * 9 * (1 - wound) : 0;

  return (
    <AbsoluteFill>
      <Backdrop warm={0.45} cool={0.8} />
      <Kicker left={96} top={312} size={26} color={C.steel}>MEMORI · APA YANG BENAR-BENAR TERSIMPAN</Kicker>
      <Rule left={96} top={366} width={1248} color="rgba(244,241,234,0.1)" />

      <div style={{position: 'absolute', left: 96, top: 440, width: 640}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: 620}}>
          <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.24em', color: C.mint}}>MENANG ×20</div>
          <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.24em', color: C.steel, opacity: clamp((t - 5.4) / 0.5, 0, 1)}}>TIDAK ADA CERITA</div>
        </div>
        <div style={{marginTop: 34, display: 'flex', flexWrap: 'wrap', width: 620, gap: 22}}>
          {Array.from({length: 20}).map((_, i) => {
            const s = spring({frame: (t - 0.3 - i * 0.035) * fps, fps, config: {damping: 24, mass: 0.5, stiffness: 210}});
            return <div key={i} style={{width: 104, height: 104, borderRadius: 24, opacity: (1 - grey * 0.84) * clamp(s * 1.4, 0, 1),
              background: `linear-gradient(160deg, ${C.mint}dd, ${C.mint}44)`, transform: `translateY(${grey * 30}px) scale(${mix(0.7, 1, s) * (1 - grey * 0.14)})`,
              boxShadow: `0 0 ${26 * (1 - grey)}px ${C.mint}44`}} />;
          })}
        </div>
      </div>

      <div style={{position: 'absolute', left: 800, top: 420, width: 500}}>
        <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.24em', color: C.coral, opacity: lossIn, textAlign: 'center'}}>KALAH ×1</div>
        <div style={{position: 'relative', height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{position: 'absolute', width: 168 + r * 100, height: 168 + r * 100, borderRadius: '50%', border: `2px solid ${C.coral}`,
              opacity: lossIn * (0.45 - r * 0.12), transform: `scale(${mix(0.7, 1, lossIn) * (1 + 0.06 * Math.sin(t * 3 - r))})`}} />
          ))}
          <div style={{width: 176, height: 176, borderRadius: '50%', background: `radial-gradient(circle at 38% 34%, ${C.coral}, #B3221B 70%)`,
            transform: `scale(${mix(0.3, 1, lossIn)})`, opacity: lossIn, boxShadow: `0 0 ${40 + 100 * burn}px ${C.coral}aa, 0 0 ${20 + 50 * burn}px ${C.coral}`}} />
        </div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56, color: C.ink, letterSpacing: '-0.02em', opacity: clamp((t - 8.1) / 0.5, 0, 1), textAlign: 'center'}}>
          JADI KENANGAN
        </div>
      </div>

      <div style={{position: 'absolute', left: 96, top: 1030, opacity: statement, transform: `translateX(${shake}px)`}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 74, color: C.dim, letterSpacing: '-0.03em', lineHeight: 1.06, textTransform: 'uppercase'}}>
          Kamu tidak mengingat<br />rata-rata.
        </div>
      </div>
      <div style={{position: 'absolute', left: 96, top: 1270, opacity: wound, transform: `translateX(${shake}px)`}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 104, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1.0, textTransform: 'uppercase'}}>
          Kamu mengingat
        </div>
        <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 186, color: C.coral, lineHeight: 1, marginTop: 2, textShadow: `0 0 80px ${C.coral}55`}}>
          luka
        </div>
      </div>
      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
