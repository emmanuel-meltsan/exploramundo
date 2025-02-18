import { Container, Box } from '@mui/material';
import AutoCompleteSelect from '../components/AutoCompleteSelect';
import SearchAllRequest from '../api/SearchAllRequest';
import { useEffect, useState } from 'react';
import FilterByCountry from '../components/FilterByCountry';
import FilterBySubRegion from '../components/FilterBySubRegion';
import FilterByLanguage from '../components/FilterByLanguage';
import FilterByRegion from '../components/FilterByRegion';
import Welcome from '../components/Welcome';
import CalculatePaginacion from '../components/CalculatePaginacion';


const ITEMS_PER_PAGE = 12;

export default function Inicio() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [categoryValues, setCategoryValues] = useState<string[]>([]);
    const [page, setPage] = useState(1); // Estado para la paginación

    useEffect(() => {
        setPage(1);
    }, [categoryValues]);

    // 📌 Calcular los elementos de la página actual
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = categoryValues.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (category: string, values: string[]) => {
        setSelectedCategory(category);
        setCategoryValues(values);
    };



    return (
        <Container maxWidth={false}>

            {/* Contenido 1 - img y despliegue*/}
            <header>
                <Welcome />
            </header>

            {/* Contenido 2 - barra de busqueda*/}
            <Box sx={{ marginTop: '35px', marginBottom: '30px' }} id="search">
                <AutoCompleteSelect onSearch={handleSearch} />
            </Box>

            {/* Contenido 3 - informacion de los paises*/}
            <Box>
                {(() => {
                    switch (selectedCategory) {
                        case 'All':
                            return categoryValues.length === 0
                                ? <SearchAllRequest />
                                : <FilterByCountry countries={currentItems} />;
                        case 'Subregión':
                            return <FilterBySubRegion subregions={currentItems} />;
                        case 'Idioma':
                            return <FilterByLanguage languages={currentItems} />;
                        case 'Región':
                            return <FilterByRegion region={currentItems[0]} />;
                        default:
                            return null;
                    }
                })()}

                <CalculatePaginacion
                    totalItems={categoryValues.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={page}
                    onPageChange={setPage}
                />

            </Box>


        </Container>
    );
}
