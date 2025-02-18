import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import CountryCartinfo from './CountryCart';

interface LanguageDetails {
    flag: string;
    countryCode: string; // Agregar código del país
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

async function getLanguageDetails(language: string): Promise<LanguageDetails[]> {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/lang/${language}`);
        if (!response.ok) throw new Error(`Error al obtener los países que hablan el idioma: ${language}`);

        const data = await response.json();
        const countries = data.map((country: any) => ({
            flag: getFlagEmoji(country.cca2.toUpperCase()), // Convertir el código a mayúsculas
            countryName: country.name.common,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital?.[0] || 'No disponible',
            languages: Object.values(country.languages || [])
        }));

        return countries;
    } catch (error) {
        console.error(`Error en getLanguageDetails para ${language}:`, error);
        return [];
    }
}

interface LanguageListProps {
    languages: string[];
}

const ITEMS_PER_PAGE = 12;

export default function FilterByLanguage({ languages }: LanguageListProps) {
    const [languageDetails, setLanguageDetails] = useState<LanguageDetails[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchLanguages() {
            const detailsPromises = languages.map((language) => getLanguageDetails(language));
            const details = await Promise.all(detailsPromises);
            setLanguageDetails(details.flat().filter((detail) => detail !== null) as LanguageDetails[]);
        }

        fetchLanguages();
    }, [languages]);

    // 📌 Calcular los elementos de la página actual
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = languageDetails.slice(indexOfFirstItem, indexOfLastItem);

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
            {languageDetails.length > ITEMS_PER_PAGE && (
                <Pagination
                    count={Math.ceil(languageDetails.length / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    sx={{ margin: '30px', display: 'flex', justifyContent: 'center' }}
                />
            )}
        </>
    );
}
