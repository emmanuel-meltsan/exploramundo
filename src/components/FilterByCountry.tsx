import { useEffect, useState } from 'react';
import CountryCartinfo from "../components/CountryCart";
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import {CountryDetails }from '../types/CountryDetails';


function getFlagEmoji(countryCode: string): string {
    const upperCode = countryCode.toUpperCase(); // Convertir a mayúsculas
    return String.fromCodePoint(...upperCode.split('').map(letter => 0x1F1E6 - 65 + letter.charCodeAt(0)));
}

async function getCountryDetails(countryName: string): Promise<CountryDetails | null> {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error(`Error al obtener el país: ${countryName}`);

        const data = await response.json();
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
    countries: string[];
}

const ITEMS_PER_PAGE = 12;

export default function FilterByCountry({ countries }: CountryListProps) {
    const [countryDetails, setCountryDetails] = useState<CountryDetails[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchCountries() {
            const detailsPromises = countries.map((countryName) => getCountryDetails(countryName));
            const details = await Promise.all(detailsPromises);
            setCountryDetails(details.filter((detail) => detail !== null) as CountryDetails[]);
        }

        fetchCountries();
    }, [countries]);

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
