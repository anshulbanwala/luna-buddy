export interface CatalogStar {
  id: string
  name: string
  ra: number
  dec: number
  mag: number
  constellation: string
}

/** Bright stars visible from northern India — RA in hours, Dec in degrees */
export const CATALOG_STARS: CatalogStar[] = [
  { id: 'Sirius', name: 'Sirius', ra: 6.752, dec: -16.716, mag: -1.46, constellation: 'Canis Major' },
  { id: 'Canopus', name: 'Canopus', ra: 6.399, dec: -52.696, mag: -0.74, constellation: 'Carina' },
  { id: 'Arcturus', name: 'Arcturus', ra: 14.261, dec: 19.182, mag: -0.05, constellation: 'Boötes' },
  { id: 'Vega', name: 'Vega', ra: 18.616, dec: 38.784, mag: 0.03, constellation: 'Lyra' },
  { id: 'Capella', name: 'Capella', ra: 5.278, dec: 45.998, mag: 0.08, constellation: 'Auriga' },
  { id: 'Rigel', name: 'Rigel', ra: 5.242, dec: -8.202, mag: 0.13, constellation: 'Orion' },
  { id: 'Procyon', name: 'Procyon', ra: 7.655, dec: 5.225, mag: 0.34, constellation: 'Canis Minor' },
  { id: 'Betelgeuse', name: 'Betelgeuse', ra: 5.919, dec: 7.407, mag: 0.42, constellation: 'Orion' },
  { id: 'Altair', name: 'Altair', ra: 19.846, dec: 8.868, mag: 0.76, constellation: 'Aquila' },
  { id: 'Aldebaran', name: 'Aldebaran', ra: 4.599, dec: 16.509, mag: 0.85, constellation: 'Taurus' },
  { id: 'Antares', name: 'Antares', ra: 16.49, dec: -26.432, mag: 0.96, constellation: 'Scorpius' },
  { id: 'Spica', name: 'Spica', ra: 13.42, dec: -11.161, mag: 0.97, constellation: 'Virgo' },
  { id: 'Pollux', name: 'Pollux', ra: 7.755, dec: 28.026, mag: 1.14, constellation: 'Gemini' },
  { id: 'Fomalhaut', name: 'Fomalhaut', ra: 22.961, dec: -29.622, mag: 1.16, constellation: 'Piscis Austrinus' },
  { id: 'Deneb', name: 'Deneb', ra: 20.69, dec: 45.28, mag: 1.25, constellation: 'Cygnus' },
  { id: 'Regulus', name: 'Regulus', ra: 10.139, dec: 11.967, mag: 1.35, constellation: 'Leo' },
  { id: 'Castor', name: 'Castor', ra: 7.576, dec: 31.888, mag: 1.57, constellation: 'Gemini' },
  { id: 'Bellatrix', name: 'Bellatrix', ra: 5.418, dec: 6.35, mag: 1.64, constellation: 'Orion' },
  { id: 'Alnilam', name: 'Alnilam', ra: 5.603, dec: -1.202, mag: 1.69, constellation: 'Orion' },
  { id: 'Alnitak', name: 'Alnitak', ra: 5.679, dec: -1.943, mag: 1.74, constellation: 'Orion' },
  { id: 'Mintaka', name: 'Mintaka', ra: 5.533, dec: -0.299, mag: 2.23, constellation: 'Orion' },
  { id: 'Saiph', name: 'Saiph', ra: 5.796, dec: -9.67, mag: 2.06, constellation: 'Orion' },
  { id: 'Polaris', name: 'Polaris', ra: 2.53, dec: 89.264, mag: 1.98, constellation: 'Ursa Minor' },
  { id: 'Schedar', name: 'Schedar', ra: 0.675, dec: 56.537, mag: 2.23, constellation: 'Cassiopeia' },
  { id: 'Caph', name: 'Caph', ra: 0.153, dec: 59.15, mag: 2.27, constellation: 'Cassiopeia' },
  { id: 'Ruchbah', name: 'Ruchbah', ra: 1.43, dec: 60.235, mag: 2.68, constellation: 'Cassiopeia' },
  { id: 'Segin', name: 'Segin', ra: 1.906, dec: 63.67, mag: 2.15, constellation: 'Cassiopeia' },
  { id: 'Alpheratz', name: 'Alpheratz', ra: 0.14, dec: 29.091, mag: 2.06, constellation: 'Andromeda' },
  { id: 'Mirach', name: 'Mirach', ra: 1.162, dec: 35.62, mag: 2.05, constellation: 'Andromeda' },
  { id: 'Almach', name: 'Almach', ra: 2.065, dec: 42.33, mag: 2.1, constellation: 'Andromeda' },
  { id: 'Markab', name: 'Markab', ra: 23.079, dec: 15.205, mag: 2.49, constellation: 'Pegasus' },
  { id: 'Scheat', name: 'Scheat', ra: 23.063, dec: 28.083, mag: 2.42, constellation: 'Pegasus' },
  { id: 'Algenib', name: 'Algenib', ra: 0.22, dec: 15.184, mag: 2.83, constellation: 'Pegasus' },
  { id: 'Enif', name: 'Enif', ra: 21.736, dec: 9.875, mag: 2.38, constellation: 'Pegasus' },
  { id: 'Sadr', name: 'Sadr', ra: 20.37, dec: 40.256, mag: 2.23, constellation: 'Cygnus' },
  { id: 'Gienah', name: 'Gienah', ra: 20.37, dec: 33.971, mag: 2.48, constellation: 'Cygnus' },
  { id: 'Albireo', name: 'Albireo', ra: 19.512, dec: 27.96, mag: 3.05, constellation: 'Cygnus' },
  { id: 'Sheliak', name: 'Sheliak', ra: 18.982, dec: 33.362, mag: 3.52, constellation: 'Lyra' },
  { id: 'Sulafat', name: 'Sulafat', ra: 18.982, dec: 32.689, mag: 3.24, constellation: 'Lyra' },
  { id: 'Rasalhague', name: 'Rasalhague', ra: 17.582, dec: 12.56, mag: 2.08, constellation: 'Ophiuchus' },
  { id: 'Kaus', name: 'Kaus Australis', ra: 18.403, dec: -34.385, mag: 1.85, constellation: 'Sagittarius' },
  { id: 'Nunki', name: 'Nunki', ra: 18.921, dec: -26.297, mag: 2.05, constellation: 'Sagittarius' },
  { id: 'Shaula', name: 'Shaula', ra: 17.56, dec: -37.104, mag: 1.62, constellation: 'Scorpius' },
  { id: 'Sargas', name: 'Sargas', ra: 17.621, dec: -42.998, mag: 1.86, constellation: 'Scorpius' },
  { id: 'Dschubba', name: 'Dschubba', ra: 16.005, dec: -22.621, mag: 2.29, constellation: 'Scorpius' },
  { id: 'Gacrux', name: 'Gacrux', ra: 12.519, dec: -57.113, mag: 1.63, constellation: 'Crux' },
  { id: 'Acrux', name: 'Acrux', ra: 12.443, dec: -63.099, mag: 0.77, constellation: 'Crux' },
  { id: 'Menkent', name: 'Menkent', ra: 14.111, dec: -36.37, mag: 2.06, constellation: 'Centaurus' },
  { id: 'Hamal', name: 'Hamal', ra: 2.119, dec: 19.293, mag: 2.01, constellation: 'Aries' },
  { id: 'Menkar', name: 'Menkar', ra: 3.038, dec: 4.09, mag: 2.54, constellation: 'Cetus' },
  { id: 'Mirfak', name: 'Mirfak', ra: 3.405, dec: 49.861, mag: 1.79, constellation: 'Perseus' },
  { id: 'Algol', name: 'Algol', ra: 3.136, dec: 40.955, mag: 2.09, constellation: 'Perseus' },
  { id: 'Alphecca', name: 'Alphecca', ra: 15.578, dec: 26.714, mag: 2.22, constellation: 'Corona Borealis' },
  { id: 'Kochab', name: 'Kochab', ra: 14.845, dec: 74.155, mag: 2.07, constellation: 'Ursa Minor' },
  { id: 'Pherkad', name: 'Pherkad', ra: 15.345, dec: 71.834, mag: 3.05, constellation: 'Ursa Minor' },
  { id: 'Alioth', name: 'Alioth', ra: 12.9, dec: 55.96, mag: 1.76, constellation: 'Ursa Major' },
  { id: 'Dubhe', name: 'Dubhe', ra: 11.062, dec: 61.751, mag: 1.81, constellation: 'Ursa Major' },
  { id: 'Merak', name: 'Merak', ra: 11.031, dec: 56.382, mag: 2.34, constellation: 'Ursa Major' },
  { id: 'Phecda', name: 'Phecda', ra: 11.897, dec: 53.695, mag: 2.41, constellation: 'Ursa Major' },
  { id: 'Megrez', name: 'Megrez', ra: 12.257, dec: 57.033, mag: 3.31, constellation: 'Ursa Major' },
  { id: 'Mizar', name: 'Mizar', ra: 13.398, dec: 54.925, mag: 2.23, constellation: 'Ursa Major' },
  { id: 'Alkaid', name: 'Alkaid', ra: 13.792, dec: 49.313, mag: 1.85, constellation: 'Ursa Major' },
]

export const CONSTELLATION_LINES: { name: string; pairs: [string, string][] }[] = [
  {
    name: 'Orion',
    pairs: [
      ['Betelgeuse', 'Bellatrix'],
      ['Bellatrix', 'Mintaka'],
      ['Mintaka', 'Alnilam'],
      ['Alnilam', 'Alnitak'],
      ['Alnitak', 'Saiph'],
      ['Saiph', 'Rigel'],
      ['Rigel', 'Mintaka'],
      ['Betelgeuse', 'Alnitak'],
    ],
  },
  {
    name: 'Cygnus',
    pairs: [
      ['Deneb', 'Sadr'],
      ['Sadr', 'Gienah'],
      ['Sadr', 'Albireo'],
    ],
  },
  {
    name: 'Lyra',
    pairs: [
      ['Vega', 'Sheliak'],
      ['Sheliak', 'Sulafat'],
      ['Sulafat', 'Vega'],
    ],
  },
  {
    name: 'Scorpius',
    pairs: [
      ['Antares', 'Dschubba'],
      ['Antares', 'Shaula'],
      ['Shaula', 'Sargas'],
    ],
  },
  {
    name: 'Cassiopeia',
    pairs: [
      ['Caph', 'Schedar'],
      ['Schedar', 'Ruchbah'],
      ['Ruchbah', 'Segin'],
    ],
  },
  {
    name: 'Ursa Major',
    pairs: [
      ['Dubhe', 'Merak'],
      ['Merak', 'Phecda'],
      ['Phecda', 'Megrez'],
      ['Megrez', 'Alioth'],
      ['Alioth', 'Mizar'],
      ['Mizar', 'Alkaid'],
      ['Megrez', 'Dubhe'],
    ],
  },
  {
    name: 'Gemini',
    pairs: [
      ['Castor', 'Pollux'],
    ],
  },
  {
    name: 'Andromeda',
    pairs: [
      ['Alpheratz', 'Mirach'],
      ['Mirach', 'Almach'],
    ],
  },
]

export const STAR_BY_ID = Object.fromEntries(CATALOG_STARS.map((s) => [s.id, s])) as Record<string, CatalogStar>

export const ZODIAC_CONSTELLATIONS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces',
]
