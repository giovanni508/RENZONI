// =====================================================================================
//  METODO A 16 STAGIONI: dati della sezione "16 stagioni"
//
//  TODO(Erica): VALIDARE nomenclatura, descrizioni e palette.
//  - Nomenclatura: quella piu' diffusa nell'armocromia italiana a 16 sottogruppi
//    (Primavera: Pura, Light, Warm, Bright · Estate: Pura, Light, Cool, Soft ·
//     Autunno: Puro, Deep, Warm, Soft · Inverno: Puro, Deep, Cool, Bright).
//    Se Erica usa nomi diversi (es. "Assoluta", nomi in italiano) basta cambiarli qui.
//  - Le palette sono INDICATIVE (6 colori dimostrativi per sottogruppo), costruite seguendo
//    sottotono / valore / intensita' di ciascun gruppo: vanno riviste con le palette reali di Erica.
//  - bg/ink: colore di fondo della sezione e del testo quando la stagione e' attiva.
// =====================================================================================

export const SEASONS = [
  {
    id: 'primavera',
    name: 'Primavera',
    traits: 'Calda, chiara, luminosa',
    text: 'Colori caldi e limpidi, pieni di luce: pesca, corallo, verde mela, turchese.',
    bg: '#F5D6BF',
    ink: '#0A0A0A',
    theme: 'light',
    groups: [
      { name: 'Pura', gloss: 'La primavera assoluta: calda e brillante.', colors: [['Corallo', '#F27E5F'], ['Pesca', '#F6A97E'], ['Narciso', '#F4C542'], ['Verde mela', '#6CC04A'], ['Turchese', '#23B2C2'], ['Cammello chiaro', '#D7B07A']] },
      { name: 'Light', gloss: 'La più chiara e delicata.', colors: [['Pesca chiaro', '#F9C6A8'], ['Salmone', '#F7A8A0'], ['Burro', '#F6E29A'], ['Menta', '#A8DDB5'], ['Acqua', '#9ED9E0'], ['Beige dorato', '#EBD5B3']] },
      { name: 'Warm', gloss: 'La più calda e dorata.', colors: [['Papavero', '#F07C2A'], ['Oro', '#E9B12F'], ['Oliva chiaro', '#A3B54A'], ['Albicocca', '#F29A5B'], ['Corallo caldo', '#EE7357'], ['Cammello', '#C99A5B']] },
      { name: 'Bright', gloss: 'La più vivace e contrastata.', colors: [['Rosso papavero', '#EE3B3B'], ['Fucsia caldo', '#F0457E'], ['Turchese vivo', '#00B5C2'], ['Smeraldo caldo', '#1DB45A'], ['Limone', '#F7DF1E'], ['Fiordaliso', '#4E7FE0']] },
    ],
  },
  {
    id: 'estate',
    name: 'Estate',
    traits: 'Fredda, chiara, morbida',
    text: 'Colori freddi e polverosi, mai urlati: cipria, lavanda, blu polvere, salvia.',
    bg: '#CDD3E4',
    ink: '#0A0A0A',
    theme: 'light',
    groups: [
      { name: 'Pura', gloss: "L'estate assoluta: fredda e delicata.", colors: [['Rosa antico', '#D58CA6'], ['Lavanda', '#A79CCB'], ['Blu polvere', '#7C9CC4'], ['Salvia fredda', '#8FB3A3'], ['Perla', '#B9BEC8'], ['Malva', '#B07A9A']] },
      { name: 'Light', gloss: 'La più chiara e luminosa.', colors: [['Confetto', '#F2B8C9'], ['Lilla', '#CDBFE6'], ['Azzurro', '#A9C6E8'], ['Menta ghiaccio', '#BDE3D7'], ['Nuvola', '#D3D7DE'], ['Glicine', '#B8A7D9']] },
      { name: 'Cool', gloss: 'La più fredda e netta.', colors: [['Lampone polvere', '#C2577F'], ['Blu freddo', '#4F78B5'], ['Verde acqua', '#4E9C95'], ['Lavanda intensa', '#8A7CC2'], ['Ardesia', '#7A8494'], ['Prugna chiara', '#9A5D8C']] },
      { name: 'Soft', gloss: 'La più smorzata e sfumata.', colors: [['Cipria', '#CFA3A8'], ['Malva grigio', '#A58C9F'], ['Salvia', '#9AAA97'], ['Blu fumo', '#8296A8'], ['Tortora', '#A89F96'], ['Rosa antico', '#B9858F']] },
    ],
  },
  {
    id: 'autunno',
    name: 'Autunno',
    traits: 'Calda, profonda, avvolgente',
    text: 'Colori caldi e densi, terrosi: ruggine, senape, oliva, cioccolato.',
    bg: '#C9773D',
    ink: '#0A0A0A',
    theme: 'light',
    groups: [
      { name: 'Puro', gloss: "L'autunno assoluto: caldo e ricco.", colors: [['Ruggine', '#B5532D'], ['Senape', '#C9962E'], ['Oliva', '#6B6B2A'], ['Zucca', '#E08A3C'], ['Terracotta', '#B8603F'], ['Cioccolato', '#5C3A24']] },
      { name: 'Deep', gloss: 'Il più profondo e scuro.', colors: [['Bordeaux caldo', '#7A2431'], ['Verde bosco', '#2F4A2E'], ['Petrolio', '#1F5C61'], ['Cacao', '#4A2C1D'], ['Melanzana', '#5B2D3E'], ['Oro antico', '#A7792E']] },
      { name: 'Warm', gloss: 'Il più caldo e speziato.', colors: [['Arancio bruciato', '#C8642A'], ['Ocra', '#D19B32'], ['Muschio', '#7A7A35'], ['Rame', '#B86B3B'], ['Cammello', '#B98852'], ['Mattone', '#A44A32']] },
      { name: 'Soft', gloss: 'Il più morbido e polveroso.', colors: [['Salvia calda', '#9C9D7A'], ['Cammello polvere', '#B79C7E'], ['Terracotta rosa', '#C08A76'], ['Cachi', '#A39B6C'], ['Verde grigio', '#7F8A73'], ['Nocciola', '#96785E']] },
    ],
  },
  {
    id: 'inverno',
    name: 'Inverno',
    traits: 'Fredda, intensa, contrastata',
    text: 'Colori freddi e decisi, ad alto contrasto: ciliegia, blu reale, smeraldo, bianco ottico.',
    bg: '#0C0E14',
    ink: '#F4F4F0',
    theme: 'dark',
    groups: [
      { name: 'Puro', gloss: "L'inverno assoluto: freddo e netto.", colors: [['Ciliegia', '#C8102E'], ['Blu reale', '#2747C4'], ['Smeraldo', '#00875A'], ['Bianco ottico', '#F7F8FA'], ['Fucsia', '#D1157A'], ['Nero', '#050507']] },
      { name: 'Deep', gloss: 'Il più profondo e drammatico.', colors: [['Bordeaux freddo', '#7A1235'], ['Blu notte', '#1B2E66'], ['Verde pino', '#0F5A43'], ['Prugna', '#5C2357'], ['Grafite', '#3A3D45'], ['Rosso vino', '#9B1F42']] },
      { name: 'Cool', gloss: 'Il più freddo e glaciale.', colors: [['Magenta freddo', '#B5197A'], ['Cobalto', '#1C4FD0'], ['Verde ghiaccio', '#139080'], ['Viola freddo', '#6A3FA0'], ['Grigio ghiaccio', '#C9D1DE'], ['Navy', '#22336E']] },
      { name: 'Bright', gloss: 'Il più brillante e luminoso.', colors: [['Fucsia acceso', '#E5007E'], ['Blu elettrico', '#0047FF'], ['Smeraldo vivo', '#00A86B'], ['Rosso fuoco', '#E4002B'], ['Limone ghiaccio', '#F4F06A'], ['Viola acceso', '#7B2FF7']] },
    ],
  },
];

// Nastro di swatch (marquee tra "Cosa faccio" e "16 stagioni"): campioni presi dalle palette sopra.
export const RIBBON = [
  ['Lampone', '#C2577F'], ['Corallo', '#F27E5F'], ['Zafferano', '#E9B12F'], ['Salvia', '#9AAA97'], ['Petrolio', '#1F5C61'],
  ['Glicine', '#B8A7D9'], ['Senape', '#C9962E'], ['Cobalto', '#1C4FD0'], ['Pesca', '#F6A97E'], ['Smeraldo', '#00875A'],
  ['Cipria', '#CFA3A8'], ['Ruggine', '#B5532D'], ['Ghiaccio', '#C9D1DE'], ['Prugna', '#5C2357'], ['Oliva', '#6B6B2A'], ['Fucsia', '#E5007E'],
];
