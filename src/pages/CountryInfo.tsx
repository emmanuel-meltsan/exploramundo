import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import CountryCartinfo from "../components/CountryCart";
import GoogleMapComponent from "../components/GoogleMapComponent";
import Grid from "@mui/material/Grid2";

interface CountryData {
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

interface NeighborData {
  flag: string;
  emojiFlag: string;
  countryName: string;
  region: string;
  subregion: string;
  capital: string;
  languages: string[];
}

// 🔹 Función para convertir el código de país en emoji de bandera
function getFlagEmoji(countryCode: string): string {
  const upperCode = countryCode.toUpperCase();
  return String.fromCodePoint(...upperCode.split("").map(letter => 0x1F1E6 - 65 + letter.charCodeAt(0)));
}

const CountryInfo: React.FC = () => {
  const { countryName } = useParams<{ countryName: string }>();
  const [country, setCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [neighbors, setNeighbors] = useState<NeighborData[]>([]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
        );
        if (!response.ok) {
          throw new Error("Country not found");
        }
        const data = await response.json();
        setCountry(data[0]);

        if (data[0].borders) {
          const borderCountries = data[0].borders.slice(0, 3);
          const borderResponses = await Promise.all(
            borderCountries.map((border) =>
              fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            )
          );
          const borderData = await Promise.all(
            borderResponses.map((response) => response.json())
          );

          // 🔹 Agregar bandera emoji al objeto `NeighborData`
          setNeighbors(borderData.map((country) => ({
            flag: country[0].flags.png,
            emojiFlag: getFlagEmoji(country[0].cca2), // Obtener la bandera en emoji
            countryName: country[0].name.common,
            region: country[0].region,
            subregion: country[0].subregion,
            capital: country[0].capital?.[0] || "Unknown",
            languages: Object.values(country[0].languages || {}),
          })));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountry();
  }, [countryName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!country) return <p>No country found</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-md shadow-lg p-4">
        <CardContent className="text-center">
          <img
            src={country.flags.png}
            alt={country.flags.alt}
            className="w-32 h-20 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{country.name.common}</h2>
          <p><strong>Capital:</strong> {country.capital?.join(", ")}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Subregion:</strong> {country.subregion}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
          <p><strong>Languages:</strong> {Object.values(country.languages).join(", ")}</p>
          <p><strong>Currency:</strong> {Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(", ")}</p>
          <Typography variant="body1">
            <strong>Map:</strong>
          </Typography>
          <GoogleMapComponent lat={country.latlng[0]} lng={country.latlng[1]} />
          <Typography variant="body1">
            <strong>Nearby Countries:</strong>
          </Typography>

          <Grid container spacing={{ xs: 1, md: 3 }} columns={{ xs: 3, sm: 6, md: 12 }}>
            {neighbors.map((neighbor) => (
              <Grid key={neighbor.countryName} size={3}>
                <CountryCartinfo
                  flag={neighbor.emojiFlag} // Pasar la bandera emoji
                  countryName={neighbor.countryName}
                  region={neighbor.region}
                  subregion={neighbor.subregion}
                  capital={neighbor.capital}
                  languages={neighbor.languages}
                />
              </Grid>
            ))}
          </Grid>

          <Button className="mt-4" onClick={() => window.history.back()}>Back</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryInfo;
