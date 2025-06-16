export interface Country {
  name: string;
  code: string;
  flag: string;
  region: string;
  capital: string;
  gdp: number; // GDP per capita in USD
  lifeExpectancy: number; // in years
  education: number; // education index (0-100)
  co2Emissions: number; // CO2 emissions per capita in tons
  population: number; // in millions
}

export const countries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    region: 'North America',
    capital: 'Washington D.C.',
    gdp: 63543,
    lifeExpectancy: 78.9,
    education: 89,
    co2Emissions: 16.1,
    population: 331
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    capital: 'Berlin',
    gdp: 46259,
    lifeExpectancy: 81.3,
    education: 92,
    co2Emissions: 9.4,
    population: 83
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    region: 'Asia',
    capital: 'Tokyo',
    gdp: 39285,
    lifeExpectancy: 84.6,
    education: 91,
    co2Emissions: 8.8,
    population: 125
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    region: 'South America',
    capital: 'Brasília',
    gdp: 8897,
    lifeExpectancy: 75.9,
    education: 76,
    co2Emissions: 2.3,
    population: 215
  },
  {
    name: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    region: 'Asia',
    capital: 'Seoul',
    gdp: 31846,
    lifeExpectancy: 83.5,
    education: 95,
    co2Emissions: 11.6,
    population: 52
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    region: 'North America',
    capital: 'Ottawa',
    gdp: 46195,
    lifeExpectancy: 82.4,
    education: 88,
    co2Emissions: 18.6,
    population: 38
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    capital: 'London',
    gdp: 41030,
    lifeExpectancy: 81.3,
    education: 90,
    co2Emissions: 5.6,
    population: 67
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    region: 'Europe',
    capital: 'Paris',
    gdp: 39030,
    lifeExpectancy: 82.7,
    education: 89,
    co2Emissions: 4.6,
    population: 68
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    region: 'Oceania',
    capital: 'Canberra',
    gdp: 51812,
    lifeExpectancy: 83.4,
    education: 87,
    co2Emissions: 15.4,
    population: 26
  },
  {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    region: 'Asia',
    capital: 'Beijing',
    gdp: 10500,
    lifeExpectancy: 77.5,
    education: 85,
    co2Emissions: 7.4,
    population: 1412
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    region: 'Asia',
    capital: 'New Delhi',
    gdp: 2277,
    lifeExpectancy: 69.7,
    education: 65,
    co2Emissions: 1.9,
    population: 1380
  },
  {
    name: 'Mexico',
    code: 'MX',
    flag: '🇲🇽',
    region: 'North America',
    capital: 'Mexico City',
    gdp: 9926,
    lifeExpectancy: 75.1,
    education: 74,
    co2Emissions: 3.7,
    population: 129
  },
  {
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    region: 'Europe',
    capital: 'Rome',
    gdp: 31952,
    lifeExpectancy: 83.6,
    education: 86,
    co2Emissions: 5.9,
    population: 60
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    region: 'Europe',
    capital: 'Madrid',
    gdp: 27057,
    lifeExpectancy: 83.6,
    education: 84,
    co2Emissions: 5.7,
    population: 47
  },
  {
    name: 'Russia',
    code: 'RU',
    flag: '🇷🇺',
    region: 'Europe/Asia',
    capital: 'Moscow',
    gdp: 11289,
    lifeExpectancy: 72.6,
    education: 82,
    co2Emissions: 11.4,
    population: 146
  },
  {
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    region: 'Europe',
    capital: 'Amsterdam',
    gdp: 52331,
    lifeExpectancy: 82.3,
    education: 91,
    co2Emissions: 8.8,
    population: 17
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    region: 'Europe',
    capital: 'Bern',
    gdp: 81867,
    lifeExpectancy: 83.8,
    education: 88,
    co2Emissions: 4.3,
    population: 9
  },
  {
    name: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    region: 'Europe',
    capital: 'Stockholm',
    gdp: 51648,
    lifeExpectancy: 82.8,
    education: 93,
    co2Emissions: 4.2,
    population: 10
  },
  {
    name: 'Norway',
    code: 'NO',
    flag: '🇳🇴',
    region: 'Europe',
    capital: 'Oslo',
    gdp: 75420,
    lifeExpectancy: 82.3,
    education: 90,
    co2Emissions: 8.3,
    population: 5
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    region: 'Asia',
    capital: 'Singapore',
    gdp: 59798,
    lifeExpectancy: 83.6,
    education: 89,
    co2Emissions: 8.6,
    population: 6
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    region: 'Oceania',
    capital: 'Wellington',
    gdp: 41945,
    lifeExpectancy: 82.4,
    education: 86,
    co2Emissions: 7.1,
    population: 5
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    region: 'Africa',
    capital: 'Cape Town',
    gdp: 6001,
    lifeExpectancy: 64.1,
    education: 70,
    co2Emissions: 8.9,
    population: 60
  },
  {
    name: 'Argentina',
    code: 'AR',
    flag: '🇦🇷',
    region: 'South America',
    capital: 'Buenos Aires',
    gdp: 10636,
    lifeExpectancy: 76.7,
    education: 79,
    co2Emissions: 4.2,
    population: 45
  },
  {
    name: 'Chile',
    code: 'CL',
    flag: '🇨🇱',
    region: 'South America',
    capital: 'Santiago',
    gdp: 15346,
    lifeExpectancy: 80.2,
    education: 81,
    co2Emissions: 4.7,
    population: 19
  },
  {
    name: 'Thailand',
    code: 'TH',
    flag: '🇹🇭',
    region: 'Asia',
    capital: 'Bangkok',
    gdp: 7233,
    lifeExpectancy: 77.2,
    education: 78,
    co2Emissions: 3.9,
    population: 70
  },
  {
    name: 'Israel',
    code: 'IL',
    flag: '🇮🇱',
    region: 'Asia',
    capital: 'Jerusalem',
    gdp: 43689,
    lifeExpectancy: 83.0,
    education: 88,
    co2Emissions: 7.3,
    population: 9
  },
  {
    name: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    region: 'Europe/Asia',
    capital: 'Ankara',
    gdp: 9539,
    lifeExpectancy: 77.7,
    education: 76,
    co2Emissions: 5.1,
    population: 85
  },
  {
    name: 'Poland',
    code: 'PL',
    flag: '🇵🇱',
    region: 'Europe',
    capital: 'Warsaw',
    gdp: 15421,
    lifeExpectancy: 78.7,
    education: 85,
    co2Emissions: 8.1,
    population: 38
  },
  {
    name: 'Belgium',
    code: 'BE',
    flag: '🇧🇪',
    region: 'Europe',
    capital: 'Brussels',
    gdp: 43582,
    lifeExpectancy: 82.0,
    education: 87,
    co2Emissions: 8.3,
    population: 11
  },
  {
    name: 'Austria',
    code: 'AT',
    flag: '🇦🇹',
    region: 'Europe',
    capital: 'Vienna',
    gdp: 45437,
    lifeExpectancy: 81.6,
    education: 87,
    co2Emissions: 7.3,
    population: 9
  }
];

export const calculateSimilarity = (country1: Country, country2: Country): { score: number; reasons: string[] } => {
  const gdpDiff = Math.abs(country1.gdp - country2.gdp) / Math.max(country1.gdp, country2.gdp);
  const lifeDiff = Math.abs(country1.lifeExpectancy - country2.lifeExpectancy) / Math.max(country1.lifeExpectancy, country2.lifeExpectancy);
  const eduDiff = Math.abs(country1.education - country2.education) / Math.max(country1.education, country2.education);
  const co2Diff = Math.abs(country1.co2Emissions - country2.co2Emissions) / Math.max(country1.co2Emissions, country2.co2Emissions);

  const weights = { gdp: 0.3, life: 0.25, education: 0.25, co2: 0.2 };
  
  const score = 1 - (
    gdpDiff * weights.gdp +
    lifeDiff * weights.life +
    eduDiff * weights.education +
    co2Diff * weights.co2
  );

  const reasons: string[] = [];
  if (gdpDiff < 0.2) reasons.push('Similar economic development');
  if (lifeDiff < 0.05) reasons.push('Comparable life expectancy');
  if (eduDiff < 0.1) reasons.push('Similar education levels');
  if (co2Diff < 0.3) reasons.push('Similar environmental impact');
  if (country1.region === country2.region) reasons.push('Same geographical region');

  return { score: Math.max(0.5, Math.min(1, score)), reasons };
};