import React from 'react';
import {AbsoluteFill, spring, useVideoConfig} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Caption} from '../ui/Caption';
import {Lane} from '../ui/Lane';
import {Kicker, Rule} from '../ui/Stat';
import {C, F, clamp, eOut} from '../theme';
import type {Act} from '../timeline';
import {mix, useLocal} from '../ui/anim';
import data from '../data/queue.json';

const L_X = 300;
const R_X = 860;
const LANE_W = 300;
const LANE_H = 600;
const LANE_Y = 380;

export const Act6: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const {fps} = useVideoConfig();
  const hop = clamp((t - 4.85) / 0.85, 0, 1);
  const hopE = eOut(hop);
  const clock = Math.min(30, t * 7.2);
  const jump = clamp((t - 5.7) / 0.45, 0, 1);
  const median = clamp((t - 9.4) / 0.6, 0, 1);
  const big = clamp((t - 10.6) / 0.5, 0, 1);
  const youX = mix(L_X + LANE_W / 2, R_X + LANE_W / 2, hopE);
  const youY = LANE_Y + LANE_H - 140 - Math.sin(hopE * Math.PI) * 210;
  const H = data.switchHist;
  const barW = (1248 - (H.length - 1) * 6) / H.length;

  return (
    <AbsoluteFill>
      <Backdrop warm={0.5} cool={0.85} />
      <Kicker left={96} top={312} size={26} color={C.steel}>HARGA SEBUAH PINDAHAN</Kicker>
      <Rule left={96} top={366} width={1248} color="rgba(244,241,234,0.1)" />

      <Lane x={L_X} y={LANE_Y} width={LANE_W} height={LANE_H} accent="amber" label="LOKET A" count={3} scroll={t * 0.06} focus={1} />
      <Lane x={R_X} y={LANE_Y} width={LANE_W} height={LANE_H} accent="ink" label="LOKET B" count={4} scroll={t * 0.14} focus={hop > 0.4 ? 0.8 : 0} />

      <div style={{position: 'absolute', left: L_X + LANE_W / 2 - 90, top: LANE_Y + LANE_H - 152, width: 180, height: 64, borderRadius: 20, border: `3px dashed ${C.amber}aa`,
        opacity: clamp((t - 4.85) / 0.4, 0, 1) * 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: 22, letterSpacing: '0.18em', color: `${C.amber}cc`}}>
        DITINGGAL
      </div>
      <div style={{position: 'absolute', left: youX - 90, top: youY, width: 180, display: 'flex', justifyContent: 'center'}}>
        <div style={{padding: '16px 28px', borderRadius: 20, background: `linear-gradient(180deg, ${C.amber}, #E7A32C)`, color: '#1A1305', fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: '0.14em',
          boxShadow: '0 18px 50px rgba(0,0,0,0.6)', transform: `rotate(${hop > 0 && hop < 1 ? -10 * Math.sin(hopE * Math.PI) : 0}deg)`}}>KAMU</div>
      </div>

      <div style={{position: 'absolute', left: 96, top: 1000, display: 'flex', alignItems: 'baseline', gap: 18}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 128, color: jump > 0.2 ? C.coral : C.ink, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums'}}>
          00:{String(Math.floor(clock)).padStart(2, '0')}
        </div>
        <div style={{position: 'absolute', left: 0, top: 150, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.22em', color: C.steel, lineHeight: 1.4}}>DETIK YANG SUDAH DIBAYAR</div>
      </div>
      {jump > 0 ? (
        <div style={{position: 'absolute', left: 462, top: 1030, fontFamily: F.mono, fontWeight: 700, fontSize: 72, color: C.coral, opacity: jump * (1 - clamp((t - 7.6) / 0.5, 0, 1)), transform: `translateY(${-30 * jump}px)`}}>+73 s</div>
      ) : null}

      <div style={{position: 'absolute', left: 96, top: 1190, width: 1248, height: 300, borderBottom: `2px solid rgba(244,241,234,0.16)`}}>
        {H.map((v: number, i: number) => {
          const s = spring({frame: (t - 6.9 - i * 0.035) * fps, fps, config: {damping: 26, mass: 0.5, stiffness: 190}});
          const h = (v / 100) * 280 * s;
          const pos = i > 13;
          return <div key={i} style={{position: 'absolute', left: i * (barW + 6), bottom: 0, width: barW, height: Math.max(2, h), borderRadius: 4, background: pos ? C.coral : 'rgba(244,241,234,0.3)', opacity: clamp(s * 1.3, 0, 1)}} />;
        })}
        <div style={{position: 'absolute', left: '54%', bottom: 0, top: -14, width: 0, borderLeft: `3px dashed ${C.amber}`, opacity: median}} />
        <div style={{position: 'absolute', left: '56%', top: -96, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.18em', color: C.amber, opacity: median}}>MEDIAN +73 s</div>
        <div style={{position: 'absolute', left: 4, top: -52, fontFamily: F.mono, fontSize: 19, letterSpacing: '0.16em', color: C.steel}}>LEBIH CEPAT</div>
        <div style={{position: 'absolute', right: 4, top: -52, fontFamily: F.mono, fontSize: 19, letterSpacing: '0.16em', color: C.coral}}>LEBIH LAMBAT</div>
      </div>

      <div style={{position: 'absolute', left: 96, top: 1560, opacity: big, transform: `translateY(${(1 - big) * 20}px)`, display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 104, color: C.coral, letterSpacing: '-0.04em'}}>82,8%</div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 46, color: C.ink, letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1.05}}>
          kasus pindah<br />jadi lebih lambat
        </div>
      </div>
      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
