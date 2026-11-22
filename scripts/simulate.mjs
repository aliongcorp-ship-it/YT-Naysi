// Numbers on screen are computed, never invented.
// Model: two checkout lanes, people arrive at random, service time is heavy-tailed
// (một order bisa 5 detik, order lain 4 menit). You join the lane with fewer people.
let seed = 987654321;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const gauss = () => {
  let u = 0, v = 0;
  while (u === 0) u = rnd();
  while (v === 0) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const SERVICE_MEAN = 40, CV = 1.25;
const sigma = Math.sqrt(Math.log(1 + CV * CV)), mu = Math.log(SERVICE_MEAN) - sigma * sigma / 2;
const service = () => Math.exp(mu + sigma * gauss());
const queueLen = () => { let n = 1; while (n < 8 && rnd() < 0.62) n++; return n; };
const laneWork = (n) => { let s = 0; for (let i = 0; i < n; i++) s += service(); return s; };

const TRIALS = 200000;
let otherFirst = 0, multiHeadOnly = 0;
const deltas = [];
let switchWorse = 0, switchBetter = 0, switchSame = 0;
const scatter = [];
let sumMine = 0, sumOther = 0, sumHeadsWrong = 0;

for (let i = 0; i < TRIALS; i++) {
  const nA = queueLen(), nB = queueLen();
  const lane = nA <= nB ? 0 : 1;
  const ahead = lane === 0 ? nA : nB;
  const otherN = lane === 0 ? nB : nA;
  const mine = laneWork(ahead);
  const theirs = laneWork(otherN);
  if (theirs < mine) otherFirst++;
  if (ahead < otherN) { // you did choose the side with fewer heads
    multiHeadOnly++;
    if (theirs < mine) sumHeadsWrong++;
  }
  sumMine += mine; sumOther += theirs;
  // switching policy: after 30 s you hop to the back of the other lane
  const extraArrivals = rnd() < 0.5 ? 0 : 1;
  const switchTotal = 30 + Math.max(0, theirs - 30) + (extraArrivals ? service() : 0);
  const d = switchTotal - mine;
  deltas.push(d);
  if (d > 1) switchWorse++; else if (d < -1) switchBetter++; else switchSame++;
  if (i < 240) scatter.push({m: Math.round(mine), t: Math.round(theirs), w: theirs < mine});
}

const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sorted = [...deltas].sort((a, b) => a - b);
const px = {
  otherFirstPct: +((otherFirst / TRIALS) * 100).toFixed(1),
  headsWrongPct: +((sumHeadsWrong / multiHeadOnly) * 100).toFixed(1),
  switchSlowerPct: +((switchWorse / TRIALS) * 100).toFixed(1),
  switchFasterPct: +((switchBetter / TRIALS) * 100).toFixed(1),
  switchSamePct: +((switchSame / TRIALS) * 100).toFixed(1),
  switchMedianPenaltySec: Math.round(sorted[Math.floor(sorted.length / 2)]),
  meanWaitSec: Math.round(sumMine / TRIALS),
  meanOtherSec: Math.round(sumOther / TRIALS),
  trials: TRIALS,
  meanSwitchPenaltySec: Math.round(mean(deltas)),
  glances: 6,
  atLeastOneLoss6Pct: +((1 - Math.pow(1 - otherFirst / TRIALS, 6)) * 100).toFixed(1),
  winPct: +((1 - otherFirst / TRIALS) * 100).toFixed(1),
};
const hist = Array(24).fill(0);
for (const d of deltas) { const b = Math.max(0, Math.min(23, Math.floor((d + 120) / 20))); hist[b]++; }
const maxH = Math.max(...hist);
const out = {px, scatter, switchHist: hist.map((v) => +((v / maxH) * 100).toFixed(1))};
import fs from 'node:fs';
fs.mkdirSync('src/data', {recursive: true});
fs.writeFileSync('src/data/queue.json', JSON.stringify(out));
console.log(JSON.stringify(px, null, 1));
