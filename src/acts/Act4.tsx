import React from 'react';
import {AbsoluteFill, spring, useVideoConfig} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Caption} from '../ui/Caption';
import {Kicker, Rule} from '../ui/Stat';
import {C, F, clamp} from '../theme';
import type {Act} from '../timeline';
import {mix, useLocal} from '../ui/anim';

const LOSS = 0.242;
const cum = (k: number) => 1 - Math.pow(1 - LOSS, k);
const SCHEDULE = [1.40, 2.15, 2.90, 3.62, 4.34, 5.06];
const LOSS_CARD = 3;

export const Act4: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const {fps} = useVideoConfig();
  const revealed = SCHEDULE.filter((s) => t >= s).length;
  const shownPct = revealed === 0 ? 0 : cum(revealed) * 100;
  const punch = clamp((t - 5.42) / 0.4, 0, 1);
  const final = clamp((t - 11.2) / 0.7, 0, 1);
  const focus = t > 8.4;

  return (
    <AbsoluteFill>
      <Backdrop warm={0.6} cool={0.75} />
      <Kicker left={96} top={312} size={26} color={C.steel}>SETIAP LIRIKAN = SATU PERBANDINGAN</Kicker>
      <div style={{position: 'absolute', left: 96, top: 350, display: 'flex', alignItems: 'flex-end', gap: 24}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 186, color: revealed ? C.amber : C.steel, letterSpacing: '-0.05em', lineHeight: 0.94, transform: `scale(${1 + Math.sin(punch * Math.PI) * 0.035})`, transformOrigin: 'left bottom'}}>
          {Math.round(shownPct)}<span style={{fontSize: 74, marginLeft: 4}}>%</span>
        </div>
        <div style={{paddingBottom: 18, fontFamily: F.mono, fontSize: 23, letterSpacing: '0.22em', color: C.dim, lineHeight: 1.55}}>
          PELUANG KAMU<br />PERNAH KALAH<br />DALAM {revealed || 6} LIRIKAN
        </div>
      </div>
      <div style={{position: 'absolute', left: 100, top: 570, display: 'flex', gap: 12}}>
        {SCHEDULE.map((s, i) => (
          <div key={i} style={{width: 62, height: 10, borderRadius: 5, background: t >= s ? (i === LOSS_CARD ? C.coral : C.mint) : 'rgba(244,241,234,0.14)', boxShadow: t >= s ? `0 0 18px ${i === LOSS_CARD ? C.coral : C.mint}77` : undefined}} />
        ))}
      </div>

      <div style={{position: 'absolute', left: 96, top: 652, display: 'flex', flexWrap: 'wrap', gap: 24, width: 1248}}>
        {SCHEDULE.map((s, i) => {
          const sp = spring({frame: (t - s) * fps, fps, config: {damping: 22, mass: 0.55, stiffness: 200}});
          const loss = i === LOSS_CARD;
          const isFocus = focus && loss;
          const dimmed = (focus && !loss ? 0.25 : 1) * (final > 0 && !loss ? 0.06 : 1);
          const mine = 42 + ((i * 31) % 48);
          const theirs = loss ? mine - 14 : mine + 10 + (i % 3) * 5;
          return (
            <div key={i} style={{width: 600, height: 336, borderRadius: 18, padding: 26, boxSizing: 'border-box', opacity: dimmed,
              border: `2px solid ${isFocus ? C.coral : 'rgba(244,241,234,0.13)'}`, background: isFocus ? 'rgba(255,81,72,0.08)' : 'rgba(15,19,26,0.72)',
              transform: `translateY(${(1 - sp) * 44}px) scale(${mix(0.95, 1, sp)})`, boxShadow: isFocus ? `0 0 90px ${C.coral}33` : 'none'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 22, letterSpacing: '0.22em', color: C.steel}}>
                <span>LIRIKAN {String(i + 1).padStart(2, '0')}</span>
                <span style={{color: loss ? C.coral : C.mint}}>{loss ? 'KALAH' : 'MENANG'}</span>
              </div>
              <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 20}}>
                {[{label: 'KAMU', w: mine, color: C.amber}, {label: 'SEBELAH', w: theirs, color: loss ? C.coral : C.ink}].map((row, j) => (
                  <div key={j} style={{display: 'flex', alignItems: 'center', gap: 14}}>
                    <div style={{width: 118, fontFamily: F.mono, fontSize: 20, letterSpacing: '0.16em', color: C.dim}}>{row.label}</div>
                    <div style={{width: `${row.w * sp}%`, height: 26, borderRadius: 13, background: row.color, opacity: 0.92}} />
                  </div>
                ))}
              </div>
              <div style={{marginTop: 26, fontFamily: F.mono, fontSize: 21, letterSpacing: '0.16em', color: loss ? C.coral : C.steel}}>
                {loss ? 'MEREKA SELESAI DULU' : 'ANGGAPANMU BENAR'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 96, top: 1450, opacity: final, transform: `translateY(${(1 - final) * 36}px)`}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 82, color: C.ink, letterSpacing: '-0.035em', lineHeight: 1.04, textTransform: 'uppercase'}}>
          Satu kali kalah,<br /><span style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, color: C.coral, fontSize: 96, textTransform: 'none'}}>itu</span> yang kamu bawa.
        </div>
      </div>
      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
