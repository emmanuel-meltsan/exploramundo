import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import CountryCartinfo from './CountryCart';
import { CountryDetails } from '../types/CountryDetails';
import CalculatePaginacion from '../components/CalculatePaginacion';
import { getFlagEmoji } from '../types/GetFlagEmoji';


async function getCountryDetailsByRegion(region: string): Promise<CountryDetails[]> {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        if (!response.ok) {
            alert("Error al obtener los países");
            throw new Error(`Error al obtener los países para la región: ${region}`);
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
        alert(`Error en getCountryDetailsByRegion para ${region}:`);
        console.error(`Error en getCountryDetailsByRegion para ${region}:`, error);
        return [];
    }
}

interface CountryListProps {
    regions: string[];  
}

const ITEMS_PER_PAGE = 12;

export default function FilterByRegion({ regions }: CountryListProps) {
    const [countryDetails, setCountryDetails] = useState<CountryDetails[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchCountriesByRegions() {
            try {
                const detailsPromises = regions.map((region) => getCountryDetailsByRegion(region));
                const details = await Promise.all(detailsPromises);
                setCountryDetails(details.flat().filter((detail) => detail !== null) as CountryDetails[]);
            } catch (error) {
                alert('Error en la obtención de países:')
                console.error('Error en la obtención de países:', error);
            }
        }

        fetchCountriesByRegions();
    }, [regions]);

    // datos de paginacion
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = countryDetails.slice(indexOfFirstItem, indexOfLastItem);

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
                totalItems={countryDetails.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={page}
                onPageChange={handlePageChange}
            />
        </>
    );
}
