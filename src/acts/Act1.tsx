import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Lane} from '../ui/Lane';
import {Caption} from '../ui/Caption';
import {ActStatement} from '../ui/Frame';
import {C, F, clamp, eOut} from '../theme';
import type {Act} from '../timeline';
import {useLocal, mix, ease} from '../ui/anim';

const LANE_Y = 452;
const LANE_H = 1030;
const L_X = 292;
const R_X = 808;
const LANE_W = 340;

export const Act1: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const intro = eOut(clamp(t / 0.9, 0, 1));
  const bobRight =
    t < 2.05 ? 0 : t < 2.75 ? ease(t, 2.05, 0.5) * 0.98 : t < 3.45 ? 0.98 + ease(t, 2.75, 0.5) * 0.98 : 1.96 + ease(t, 3.45, 0.6) * 1.1;
  const leftAdvance = t < 5.9 ? 0 : Math.min(1.75, (t - 5.9) * 3.2);
  const hop = clamp((t - 3.77) / 1.1, 0, 1);
  const hopP = eOut(hop);
  const youX = mix(L_X + LANE_W / 2, R_X + LANE_W / 2, hopP);
  const youY = LANE_Y + LANE_H - 196 - Math.sin(hopP * Math.PI) * 250;
  const zoom = 1 + 0.03 * eOut(clamp(t / 9, 0, 1));
  const shake = t > 5.9 && t < 6.4 ? Math.sin((t - 5.9) * 90) * 6 * (1 - (t - 5.9) / 0.5) : 0;
  const stamp = clamp((t - 8.5) / 0.32, 0, 1);
  const clock = Math.max(0, t - 0.2);

  return (
    <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${shake}px)`, transformOrigin: '50% 40%'}}>
      <Backdrop warm={1} cool={0.7} />
      <AbsoluteFill style={{opacity: intro}}>
        <div style={{position: 'absolute', left: 96, top: 312, fontFamily: F.mono, fontSize: 26, letterSpacing: '0.3em', color: C.steel}}>
          LOKET SUPERMARKET · 19.42
        </div>
        <div style={{position: 'absolute', right: 250, top: 300, fontFamily: F.mono, fontSize: 44, letterSpacing: '0.16em', color: C.dim, textAlign: 'right'}}>
          <span style={{color: C.amber}}>00:{String(Math.floor(clock)).padStart(2, '0')}</span>
          <div style={{fontSize: 20, letterSpacing: '0.28em', color: C.steel, marginTop: 6}}>MENUNGGU</div>
        </div>

        <div style={{transform: `translateY(${(1 - intro) * 150}px)`}}>
          <Lane x={L_X} y={LANE_Y} width={LANE_W} height={LANE_H} accent="amber" label="LOKET A" count={4} scroll={leftAdvance} focus={clamp((t - 0.35) / 0.4, 0, 1) * (t < 5.9 ? 1 : 0.45)} />
          <Lane x={R_X} y={LANE_Y} width={LANE_W} height={LANE_H} accent="ink" label="LOKET B" count={3} scroll={bobRight} focus={t > 3.7 ? 0.7 : 0} dim={t > 2.0 ? 1 : 0.6} />
        </div>

        {t > 0.7 ? (
          <div style={{position: 'absolute', left: youX - 90, top: youY, width: 180, display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', inset: -24, borderRadius: 60, boxShadow: `0 0 ${46 + 26 * Math.sin(t * 6)}px ${C.amber}55`, background: `${C.amber}14`, opacity: hop > 0 ? 0.55 : 1}} />
              <div style={{padding: '18px 30px', borderRadius: 24, background: `linear-gradient(180deg, ${C.amber}, #E7A32C)`, color: '#1A1305', fontFamily: F.mono, fontWeight: 700, fontSize: 32, letterSpacing: '0.14em', boxShadow: '0 20px 60px rgba(0,0,0,0.65)', transform: `rotate(${hop > 0 && hop < 1 ? -8 * Math.sin(hop * Math.PI) : 0}deg)`}}>
                KAMU
              </div>
            </div>
          </div>
        ) : null}

        {t > 5.9 && t < 7.5 ? (
          <AbsoluteFill>
            {Array.from({length: 10}).map((_, i) => {
              const p = clamp((t - 5.9 - i * 0.045) / 0.5, 0, 1);
              return <div key={i} style={{position: 'absolute', left: L_X - 130 - p * 80, top: LANE_Y + 120 + i * 92, width: 90 + p * 120, height: 3, background: `linear-gradient(90deg, transparent, ${C.amber}aa)`, opacity: (1 - p) * 0.9}} />;
            })}
          </AbsoluteFill>
        ) : null}

        <div style={{opacity: 1 - clamp((t - 8.35) / 0.22, 0, 1)}}>
          <ActStatement y={1560}>Dua antrean. Satu keputusan.</ActStatement>
        </div>
        <div
          style={{
            position: 'absolute', left: 96, top: 1530, transform: `rotate(-4deg) scale(${interpolate(stamp, [0, 1], [1.4, 1])})`, opacity: stamp,
            border: `5px solid ${C.coral}`, padding: '10px 34px', borderRadius: 10, fontFamily: F.display, fontWeight: 800,
            fontSize: 92, color: C.coral, letterSpacing: '0.01em', textShadow: `0 0 50px ${C.coral}66`, background: 'rgba(255,81,72,0.06)',
          }}
        >
          SELALU SALAH PILIH?
        </div>
      </AbsoluteFill>
      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
