import { useEffect, useState } from 'react';
import CountryCart from "../components/CountryCart";
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import CalculatePaginacion from "../components/CalculatePaginacion"; // Importa el componente de paginación
import { CountryDetails } from "../types/CountryDetails";


function getFlagEmoji(countryCode: string): string {
    return String.fromCodePoint(  ...countryCode.split('').map(letter => 0x1F1E6 - 65 + letter.charCodeAt(0)));
}

export async function ListCountriesDetails(): Promise<CountryDetails[]> {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Error al obtener los países");

        const data = await response.json();

        return data.map((country: any) => ({
            flag: getFlagEmoji(country.cca2),
            countryName: country.name.common,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital?.[0] || 'No disponible',
            languages: Object.values(country.languages || [])
        }));

    } catch (error) {
        console.error("Error en ListCountriesDetails:", error);
        return [];
    }
}

const ITEMS_PER_PAGE = 12;

export default function SearchAllRequest() {
    const [countries, setCountries] = useState<CountryDetails[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const countryDetails = await ListCountriesDetails();
            setCountries(countryDetails);
            setLoading(false);
        }
        fetchData();
    }, []);

    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = countries.slice(indexOfFirstItem, indexOfLastItem);

    // Manejo de cambio de página con la función onPageChange
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <>
            <Grid container spacing={{ xs: 1, md: 3 }} columns={{ xs: 3, sm: 6, md: 12 }}>
                {loading
                    ? [...Array(ITEMS_PER_PAGE)].map((_, index) => (
                        <Grid key={index} size={3}>
                            <Skeleton variant="rectangular" width="100%" height={140} />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                        </Grid>
                    ))
                    : currentItems.map((country) => (
                        <Grid key={country.countryName} size={3}>
                            <CountryCart
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

            {/* Usar el componente de paginación */}
            <CalculatePaginacion
                totalItems={countries.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={page}
                onPageChange={handlePageChange}
            />
        </>
    );
}
