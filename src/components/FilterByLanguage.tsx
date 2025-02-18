import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import CountryCartinfo from './CountryCart';
import { CountryDetails } from '../types/CountryDetails';
import CalculatePaginacion from '../components/CalculatePaginacion';
import { getFlagEmoji } from '../types/GetFlagEmoji';


async function getLanguageDetails(language: string): Promise<CountryDetails[]> {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/lang/${language}`);
        if (!response.ok) {
            alert("Error al obtener los países");
            throw new Error(`Error al obtener los países que hablan el idioma: ${language}`);
        }

        const data = await response.json();
        const countries = data.map((country: any) => ({
            flag: getFlagEmoji(country.cca2.toUpperCase()),
            countryName: country.name.common,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital?.[0] || 'No disponible',
            languages: Object.values(country.languages || [])
        }));

        return countries;
    } catch (error) {
        alert(`Error en getLanguageDetails para ${language}:`);
        console.error(`Error en getLanguageDetails para ${language}:`, error);
        return [];
    }
}

interface LanguageListProps {
    languages: string[];
}

const ITEMS_PER_PAGE = 12;

export default function FilterByLanguage({ languages }: LanguageListProps) {
    const [CountryDetails, setCountryDetails] = useState<CountryDetails[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchLanguages() {
            const detailsPromises = languages.map((language) => getLanguageDetails(language));
            const details = await Promise.all(detailsPromises);
            setCountryDetails(details.flat().filter((detail) => detail !== null) as CountryDetails[]);
        }

        fetchLanguages();
    }, [languages]);

    // datos de paginacion
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = CountryDetails.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
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
            <CalculatePaginacion
                totalItems={languages.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={page}
                onPageChange={handlePageChange}
            />
        </>
    );
}
