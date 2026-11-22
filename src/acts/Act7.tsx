import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Caption} from '../ui/Caption';
import {Lane} from '../ui/Lane';
import {C, F, clamp} from '../theme';
import type {Act} from '../timeline';
import {useLocal} from '../ui/anim';

export const Act7: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const a1 = clamp((t - 3.1) / 0.6, 0, 1);
  const a2 = clamp((t - 4.75) / 0.6, 0, 1);
  const a3 = clamp((t - 7.0) / 0.6, 0, 1);
  const card = clamp((t - 8.9) / 0.8, 0, 1);
  const calm = clamp(t / 1.4, 0, 1);

  return (
    <AbsoluteFill>
      <Backdrop warm={0.5} cool={0.4} />
      <AbsoluteFill style={{opacity: 0.3 * calm}}>
        <Lane x={470} y={1120} width={200} height={340} accent="amber" label="A" count={3} scroll={0} dim={0.5} />
        <Lane x={780} y={1120} width={200} height={340} accent="ink" label="B" count={3} scroll={0} dim={0.5} />
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 96, top: 420}}>
        <div style={{opacity: a1, transform: `translateY(${(1 - a1) * 30}px)`, fontFamily: F.display, fontWeight: 800, fontSize: 74, color: C.dim, letterSpacing: '-0.035em', lineHeight: 1.04, textTransform: 'uppercase'}}>
          Kamu tidak<br />sedang apes.
        </div>
        <div style={{opacity: a2, transform: `translateY(${(1 - a2) * 30}px)`, marginTop: 42, fontFamily: F.display, fontWeight: 800, fontSize: 60, color: C.steel, letterSpacing: '-0.03em', lineHeight: 1.06, textTransform: 'uppercase'}}>
          Kamu sedang menonton<br />otakmu <span style={{color: C.ink}}>bekerja</span>.
        </div>
        <div style={{opacity: a3, transform: `translateY(${(1 - a3) * 30}px)`, marginTop: 44, fontFamily: F.display, fontWeight: 800, fontSize: 96, color: C.amber, letterSpacing: '-0.04em', lineHeight: 1.0, textTransform: 'uppercase'}}>
          Berdiri<br />di tempat.
        </div>
      </div>

      <div style={{position: 'absolute', left: 96, top: 1530, opacity: card, transform: `translateY(${(1 - card) * 24}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: C.amber, boxShadow: `0 0 22px ${C.amber}`}} />
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 32, letterSpacing: '0.42em', color: C.ink}}>NAYSI</div>
          <div style={{fontFamily: F.mono, fontSize: 21, letterSpacing: '0.22em', color: C.steel, marginLeft: 8}}>PILIHANMU SUDAH CUKUP BENAR</div>
        </div>
        <div style={{marginTop: 14, fontFamily: F.mono, fontSize: 20, color: C.steel, letterSpacing: '0.14em', opacity: 0.85}}>
          200.000 SIMULASI · MODEL ANTREAN DUA LOKET · WAKTU LAYANAN ACAK
        </div>
      </div>
      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
