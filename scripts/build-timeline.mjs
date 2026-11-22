// Single source of truth: VO audio -> act timings -> word timings -> frames.
// The picture and the soundtrack are both generated from this file.
import fs from 'node:fs';

const FPS = 90;
const wavDur = (p) => (fs.statSync(p).size - 44) / 96000;
const LEAD = 0.35;
const GAPS = [0.42, 0.42, 0.46, 0.42, 0.46, 0.62, 0];
const TAIL = 1.5;

const SEGMENTS = [
  {id: 'hook', label: 'DUA ANTREAN', text: 'Kamu pilih antrean ini. Sebelah sana jalan terus. Kamu pindah, dan antrean yang kamu tinggalkan langsung bergerak. Rasanya, kamu selalu salah pilih.'},
  {id: 'reveal', label: '200.000 SIMULASI', text: 'Padahal tidak. Aku menjalankan dua ratus ribu simulasi kasir. Hasilnya: antrean sebelah memang lebih cepat, satu dari empat kali. Masalahnya bukan angka itu. Masalahnya, apa yang otakmu simpan.'},
  {id: 'heads', label: 'KEPALA BUKAN DETIK', text: 'Kamu memilih sisi dengan orang paling sedikit, dan itu benar tiga dari empat kali. Tapi jumlah kepala bukan jumlah waktu. Satu orang bisa bayar lima detik, satu orang lagi lima menit. Jadi yang mengantre di depanmu bukan orang, tapi detik.'},
  {id: 'glance', label: 'ENAM LIRIKAN', text: 'Lalu kamu melirik. Satu lirikan: satu dari empat kali kamu kalah. Enam lirikan: delapan puluh satu persen. Hampir pasti, di satu titik, kamu melihat antrean lain bergerak duluan. Dan hanya itu yang tinggal.'},
  {id: 'memory', label: 'YANG DISIMPAN', text: 'Otak menyimpan yang menyakitkan lebih dalam daripada yang biasa. Dua puluh kali kamu menang, tidak ada cerita. Satu kali kamu kalah, jadi kenangan. Kamu tidak mengingat rata-rata. Kamu mengingat luka.'},
  {id: 'cost', label: 'HARGA PINDAH', text: 'Dan di sinilah mahalnya. Pindah berarti mulai dari belakang, dan kehilangan tiga puluh detik yang sudah kamu bayar. Di delapan puluh tiga persen kasus, pindah antrean bikin kamu pulang lebih lambat. Mediannya, tambahan tujuh puluh tiga detik.'},
  {id: 'close', label: 'BERDIRI DI TEMPAT', text: 'Jadi lain kali, saat antrean sebelah bergerak duluan: kamu tidak sedang apes. Kamu sedang menonton otakmu bekerja. Berdiri di tempat. Pilihanmu sudah cukup benar.'},
];

const words = (text) => text.split(/\s+/).filter(Boolean);
const ACTS = [];
let t = LEAD;
SEGMENTS.forEach((seg, i) => {
  const file = `audio/vo_fx/s${i + 1}.wav`;
  const dur = wavDur(file);
  const ws = words(seg.text);
  const weights = ws.map((w) => {
    let wt = w.replace(/[^\p{L}\p{N}]/gu, '').length + 2.5;
    if (/[,;:]$/.test(w)) wt += 5.5;
    if (/[.!?]$/.test(w)) wt += 9;
    return wt;
  });
  const totalW = weights.reduce((a, b) => a + b, 0);
  const usable = dur - 0.08;
  let cur = 0;
  const wl = ws.map((w, k) => {
    const d = (weights[k] / totalW) * usable;
    const item = {w, t: +(t + cur).toFixed(4), d: +d.toFixed(4)};
    cur += d;
    return item;
  });
  // phrases: break on punctuation, max 4 words
  const phrases = [];
  let group = [];
  wl.forEach((item) => {
    group.push(item);
    const punct = /[,;:.!?]$/.test(item.w);
    if (punct || group.length >= 4) { phrases.push(group); group = []; }
  });
  if (group.length) phrases.push(group);
  const phraseOut = phrases.map((g, gi) => ({
    words: g.map((x) => ({w: x.w, t: x.t, d: x.d})),
    start: g[0].t,
    end: +(g[g.length - 1].t + g[g.length - 1].d).toFixed(3),
    index: gi,
  }));
  ACTS.push({
    index: i + 1, id: seg.id, label: seg.label, vo: file,
    voStart: +t.toFixed(4), voEnd: +(t + dur).toFixed(4),
    start: +(i === 0 ? 0 : ACTS[i - 1].end).toFixed(4),
    end: +(t + dur + GAPS[i]).toFixed(4),
    words: wl, phrases: phraseOut,
  });
  t += dur + GAPS[i];
});
const end = +(t + TAIL).toFixed(3);
const durationInFrames = Math.ceil(end * FPS);

fs.mkdirSync('src/data', {recursive: true});
fs.writeFileSync('src/data/timeline.json', JSON.stringify({
  fps: FPS, width: 1440, height: 2560, durationInFrames, durationSec: end, acts: ACTS,
}, null, 1));
// audio build sheet for the synth
fs.writeFileSync('src/data/cues.json', JSON.stringify({
  durationSec: end,
  acts: ACTS.map((a) => ({index: a.index, id: a.id, label: a.label, start: a.start, end: a.end, voStart: a.voStart, voEnd: a.voEnd, phrases: a.phrases.map((p) => p.start)})),
}, null, 1));
console.log('duration', end.toFixed(2), 's |', durationInFrames, 'frames |', (durationInFrames / FPS / 60).toFixed(2), 'min');
ACTS.forEach((a) => console.log(String(a.index).padStart(2), a.id.padEnd(7), a.start.toFixed(2).padStart(6), '->', a.end.toFixed(2).padStart(6), ' vo', (a.voEnd - a.voStart).toFixed(2)));
