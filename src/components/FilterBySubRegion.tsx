import { useEffect, useState } from 'react';
import CountryCartinfo from "../components/CountryCart";
import Grid from '@mui/material/Grid2';
import { CountryDetails } from '../types/CountryDetails';
import CalculatePaginacion from '../components/CalculatePaginacion';
import { getFlagEmoji } from '../types/GetFlagEmoji';



async function getCountryDetails(countryName: string): Promise<CountryDetails | null> {
    try {

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            alert("Error al obtener los países");
            throw new Error(`Error al obtener el país: ${countryName}`);
        }

        const data = await response.json();
        const country = data[0];

        return {
            flag: getFlagEmoji(country.cca2.toUpperCase()),
            countryName: country.name.common,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital?.[0] || 'No disponible',
            languages: Object.values(country.languages || [])
        };
    } catch (error) {
        alert(`Error en getCountryDetails para ${countryName}:`);
        console.error(`Error en getCountryDetails para ${countryName}:`, error);
        return null;
    }
}

interface CountryListProps {
    subregions: string[]; // Accept multiple subregions
}

const ITEMS_PER_PAGE = 12;

export default function FilterBySubRegion({ subregions }: CountryListProps) {
    const [countryDetails, setCountryDetails] = useState<CountryDetails[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchCountriesBySubRegions() {
            const allCountries: CountryDetails[] = [];

            for (const subregion of subregions) {
                const response = await fetch(`https://restcountries.com/v3.1/subregion/${subregion}`);
                if (response.ok) {
                    const data = await response.json();
                    const detailsPromises = data.map((country: any) => getCountryDetails(country.name.common));
                    const details = await Promise.all(detailsPromises);
                    allCountries.push(...details.filter((detail) => detail !== null) as CountryDetails[]);
                } else {
                    alert(`Error al obtener países para la subregión ${subregion}`)
                    console.error(`Error al obtener países para la subregión ${subregion}`);
                }
            }

            setCountryDetails(allCountries);
        }

        fetchCountriesBySubRegions();
    }, [subregions]);

    // Datos de paginacion
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
