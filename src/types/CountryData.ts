
export interface CountryData {
    name: { common: string };
    flags: { png: string; alt: string };
    capital: string[];
    region: string;
    subregion: string;
    population: number;
    languages: { [key: string]: string };
    currencies: { [key: string]: { name: string; symbol: string } };
    maps: { googleMaps: string; openStreetMaps: string };
    borders: string[];
    latlng: [number, number];
    cca2: string; 
  }