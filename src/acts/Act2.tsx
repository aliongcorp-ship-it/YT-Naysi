import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../ui/Backdrop';
import {Caption} from '../ui/Caption';
import {BigNumber, Kicker, Rule} from '../ui/Stat';
import {ActStatement} from '../ui/Frame';
import {C, F, clamp} from '../theme';
import type {Act} from '../timeline';
import {easeQ, mix, useLocal} from '../ui/anim';
import data from '../data/queue.json';

const COLS = 20;
const ROWS = 10;
const CELL = 62;
const GRID_X = 96;
const GRID_Y = 430;
const isLoss = (i: number) => (Math.imul(i + 1, 2654435761) >>> 0) % 100 < 24.2;

export const Act2: React.FC<{act: Act}> = ({act}) => {
  const {t} = useLocal(act.start);
  const pct = data.px.otherFirstPct;
  const count = pct * easeQ(t, 1.15, 2.2);
  const landed = clamp((t - 3.35) / 0.35, 0, 1);
  const dim = 1 - clamp((t - 9.25) / 0.5, 0, 1);
  const gridOut = 1 - clamp((t - 9.3) / 0.6, 0, 1);
  const memory = clamp((t - 10.9) / 0.9, 0, 1);
  const tilesIn = clamp((t - 6.9) / 0.4, 0, 1) * (1 - clamp((t - 10.4) / 0.4, 0, 1));
  const tileStagger = (i: number) => clamp((t - 6.92 - i * 0.09) / 0.35, 0, 1);

  return (
    <AbsoluteFill>
      <Backdrop warm={0.85} cool={0.6} />
      <Kicker left={96} top={312} size={26} color={C.steel}>SIMULASI · 2 LOKET · {data.px.trials.toLocaleString('id-ID')} KASIR</Kicker>
      <Rule left={96} top={366} width={1248} color="rgba(244,241,234,0.12)" />

      <div style={{position: 'absolute', left: GRID_X, top: GRID_Y, opacity: gridOut}}>
        {Array.from({length: COLS * ROWS}).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const loss = isLoss(i);
          const a = clamp((t - 0.35 - (row * 0.045 + col * 0.012)) / 0.3, 0, 1);
          const keep = loss ? 1 : 1 - memory * 0.93;
          return (
            <div key={i} style={{position: 'absolute', left: col * CELL, top: row * CELL, width: 34, height: 34, borderRadius: 9,
              background: loss ? C.coral : 'rgba(244,241,234,0.52)', opacity: a * keep * (loss && memory > 0 ? 0.7 + 0.3 * Math.sin(t * 5 + i) : 1),
              transform: `scale(${a * (loss && memory > 0 ? 1.2 : 1)})`, boxShadow: loss ? `0 0 ${10 + 20 * memory}px ${C.coral}88` : 'none'}} />
          );
        })}
      </div>
      <div style={{position: 'absolute', left: GRID_X + 4, top: GRID_Y + ROWS * CELL + 10, fontFamily: F.mono, fontSize: 23, letterSpacing: '0.2em', color: C.steel, opacity: gridOut}}>
        1 TITIK = 1.000 SIMULASI · <span style={{color: C.coral}}>MERAH = KAMU KALAH</span>
      </div>

      <div style={{opacity: dim}}>
        <BigNumber value={count} left={92} top={1090} size={330} decimals={landed > 0.98 ? 1 : 0} suffix="%" enter={0.9} punch={Math.sin(landed * Math.PI)} />
        <div style={{position: 'absolute', left: 100, top: 1436, fontFamily: F.mono, fontSize: 30, letterSpacing: '0.24em', color: C.ink}}>ANTREAN SEBELAH SELESAI LEBIH DULU</div>
        <div style={{position: 'absolute', left: 96, top: 1392, width: 320 + 80 * landed, height: 4, background: C.amber, opacity: 0.9}} />
      </div>

      <div style={{position: 'absolute', left: 96, top: 1520, display: 'flex', gap: 16, opacity: tilesIn}}>
        {[0, 1, 2, 3].map((i) => {
          const s = tileStagger(i);
          const loss = i === 3;
          return (
            <div key={i} style={{width: 296, height: 152, borderRadius: 16, transform: `translateY(${(1 - s) * 40}px) scale(${mix(0.92, 1, s)})`, opacity: s,
              border: `2px solid ${loss ? C.coral : 'rgba(75,235,160,0.5)'}`, background: loss ? 'rgba(255,81,72,0.1)' : 'rgba(75,235,160,0.06)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 18, boxSizing: 'border-box'}}>
              <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.2em', color: loss ? C.coral : C.mint}}>{`0${i + 1}`}</div>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 46, color: loss ? C.coral : C.mint, letterSpacing: '-0.02em', lineHeight: 1}}>
                {loss ? 'KALAH' : 'MENANG'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 96, top: 1092, opacity: memory, transform: `translateY(${(1 - memory) * 30}px)`}}>
        <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.3em', color: C.steel}}>YANG TINGGAL DI KEPALA</div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 96, color: C.ink, letterSpacing: '-0.03em', marginTop: 14, lineHeight: 0.98}}>
          HANYA YANG <span style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, color: C.coral, fontSize: 116}}>merah</span>
        </div>
      </div>

      <Caption act={act} t={act.start + t} />
    </AbsoluteFill>
  );
};
