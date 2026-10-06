// Configurazione della pipeline video (scripts/media.mjs).
//
// Per sostituire o aggiungere una clip: modifica questa lista e lancia `npm run media`.
//  - src:    file in ../mateirali (gli originali NON vengono mai modificati)
//  - start:  secondo di inizio del segmento, dur: durata in secondi (3-10 s, loop-friendly)
//  - crop:   ritaglio in pixel sul fotogramma ORIGINALE (null = fotogramma intero 9:16)
//  - widths: larghezze di uscita [desktop, mobile]; l'altezza segue il rapporto del ritaglio
//  - poster: secondo ASSOLUTO del fotogramma usato come poster (fallback, prefers-reduced-motion, Save-Data)
//  - faces:  true se nella clip compaiono volti di clienti -> serve liberatoria prima della pubblicazione
//
// Note sulle sorgenti (vedi README): sono reel verticali da iPhone, quasi tutti HDR HLG (tone-mapping automatico)
// e quasi tutti con sottotitoli impressi: i segmenti qui sotto sono stati scelti dove NON ci sono sottotitoli.

const A = 'copy_401914D0-42FD-4097-A2E1-F5FFB126D797.mp4'; // studio bianco, nessun sottotitolo
const B = '67A38F44-7CF4-4E5C-B4D4-01749EE48C8C.mp4'; // salone in marmo, Erica in blazer cobalto
const C = 'f3988dafcafa4139933da4314be2fafd.mov'; // luce naturale, drappi viola/magenta

export const CLIPS = [
  // "Cosa faccio": dal bianco e nero al colore, poi il primo drappo lanciato sul viso. Ritaglio 4:5.
  { id: 'drappo', src: A, start: 2.2, dur: 4.4, crop: { x: 0, y: 230, w: 1080, h: 1350 }, widths: [720, 480], poster: 5.2, faces: true },

  // Galleria (9:16)
  { id: 'sequenza', src: A, start: 34.0, dur: 8.0, crop: null, widths: [720, 540], poster: 36.6, faces: true },
  { id: 'lame', src: A, start: 18.2, dur: 6.0, crop: null, widths: [720, 540], poster: 20.6, faces: true },
  { id: 'ventaglio', src: A, start: 51.6, dur: 7.0, crop: null, widths: [720, 540], poster: 53.0, faces: true },
  { id: 'lilla', src: B, start: 61.9, dur: 5.6, crop: null, widths: [720, 540], poster: 63.2, faces: true },
  { id: 'viola', src: C, start: 35.4, dur: 3.9, crop: null, widths: [720, 540], poster: 37.6, faces: true },

  // Primo piano dei drappi SENZA volto (ritaglio sotto il mento): utilizzabile anche senza liberatorie.
  { id: 'macro', src: A, start: 34.2, dur: 9.0, crop: { x: 0, y: 960, w: 1080, h: 810 }, widths: [800, 560], poster: 38.6, faces: false },
];

// Qualita'. Target: < 2-3 MB per clip di sezione.
export const ENCODE = {
  h264: { crf: 26, preset: 'slow' },
  av1: { crf: 40, preset: 6 },
  fps: 30,
};
