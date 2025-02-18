import { useEffect, useState } from 'react';
import CountryCartinfo from "../components/CountryCart";
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';

interface CountryDetails {
    flag: string;
    countryName: string;
    region: string;
    subregion: string;
    capital: string;
    languages: string[];
}

function getFlagEmoji(countryCode: string): string {
    const upperCode = countryCode.toUpperCase(); // Convertir a mayúsculas
    return String.fromCodePoint(...upperCode.split('').map(letter => 0x1F1E6 - 65 + letter.charCodeAt(0)));
}

async function getCountryDetails(countryName: string): Promise<CountryDetails | null> {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error(`Error al obtener el país: ${countryName}`);

        const data = await response.json();
        console.log(`Datos del país ${countryName}:`, data); // Verificar los datos
        const country = data[0];

        return {
            flag: getFlagEmoji(country.cca2.toUpperCase()), // Convertir el código a mayúsculas
            countryName: country.name.common,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital?.[0] || 'No disponible',
            languages: Object.values(country.languages || [])
        };
    } catch (error) {
        console.error(`Error en getCountryDetails para ${countryName}:`, error);
        return null;
    }
}

interface CountryListProps {
    region: string; // Acepta una sola región
}

const ITEMS_PER_PAGE = 12;

export default function FilterByRegion({ region }: CountryListProps) {
    const [countryDetails, setCountryDetails] = useState<CountryDetails[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchCountriesByRegion() {
            try {
                const url = `https://restcountries.com/v3.1/region/${region}`;
                console.log(`Consultando la URL: ${url}`); // Verificar la URL
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    console.log(`Datos de la región ${region}:`, data); // Verificar los datos

                    const detailsPromises = data.map((country: any) => getCountryDetails(country.name.common));
                    const details = await Promise.all(detailsPromises);
                    setCountryDetails(details.filter((detail) => detail !== null) as CountryDetails[]);
                } else {
                    console.error(`Error al obtener países para la región ${region}`);
                }
            } catch (error) {
                console.error('Error en la obtención de países:', error);
            }
        }

        fetchCountriesByRegion();
    }, [region]);

    // 📌 Calcular los elementos de la página actual
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = countryDetails.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <Grid container spacing={{ xs: 1, md: 3 }} columns={{ xs: 3, sm: 6, md: 12 }}>
                {currentItems.map((country) => (
                    <Grid key={country.countryName} size={3}>
                        <CountryCartinfo
                            flag={country.flag}
                            countryName={country.countryName}
                            region={country.region}
                            subregion={country.subregion}
                            capital={country.capital}
                            languages={country.languages}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* 📌 Paginación solo si hay más de 10 elementos */}
            {countryDetails.length > ITEMS_PER_PAGE && (
                <Pagination
                    count={Math.ceil(countryDetails.length / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    sx={{ margin: '30px', display: 'flex', justifyContent: 'center' }}
                />
            )}
        </>
    );
}
