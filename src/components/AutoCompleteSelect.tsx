import React, { useState, useEffect } from "react";
import {
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    SelectChangeEvent,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import { ListCountries } from "../api/ListCountries";
import { ListSubregions } from "../api/ListSubregions";
import { ListRegiones } from "../api/ListRegiones";
import { ListLanguage } from "../api/ListLanguage";



interface Option {
    title: string;
    value: string;
}

// Lista de categorías
const CATEGORIES = [
    { label: "Todos", value: "All" },
    { label: "Región", value: "Región" },
    { label: "Subregión", value: "Subregión" },
    { label: "Idioma", value: "Idioma" },
];

// valores de las categorias
const categoryvalue = async (category: string): Promise<string[]> => {
    try {
        switch (category) {
            case "Región":
                return await ListRegiones();
            case "Subregión":
                return await ListSubregions();
            case "Idioma":
                return await ListLanguage();
            default:
                return await ListCountries();
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return [];
    }
};

// Componente para Autocomplete
const AutoCompleteSearch: React.FC<{
    label: string;
    options: Option[];
    value: Option[];
    onChange: (newValue: Option[] | null) => void
}> = ({ label, options, value, onChange }) => {
    
    const handleChange = (_: unknown, newValue: Option[] | null) => {
        onChange(newValue ?? []);
    };
    

    return (
        <Autocomplete
            multiple
            id="autocomplete"
            options={options}
            getOptionLabel={(option) => option.title}
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
            sx={{ width: "40%" }}
            disableClearable
        />
    );
};


const AutocompleteSelect: React.FC<{
    onSearch: (category: string, values: string[]) => void
}> = ({ onSearch }) => {

    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [autocompleteValue, setAutocompleteValue] = useState<Option[]>([]);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await categoryvalue(selectedCategory);
            setOptions(data.map((name) => ({ title: name, value: name })));
        };

        fetchData();
    }, [selectedCategory]);

    const handleCategoryChange = async (event: SelectChangeEvent<string>) => {

        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        setAutocompleteValue([]);

        try {
            const data = await categoryvalue(newCategory);
            setOptions(data.map((name) => ({ title: name, value: name })));
        } catch (error) {
            console.error("Error al obtener opciones:", error);
        }
    };

    const handleSearch = () => {
        console.log("Buscando:", autocompleteValue);
        const getcategory = selectedCategory;
        const getvalue = autocompleteValue;

        // bandera
        console.log("Categoría:", getcategory);
        console.log("Valor:", getvalue.map((item) => item.value));

        // datos del evento de búsqueda
        onSearch(getcategory, getvalue.map((item) => item.value));
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "80%" }}>
            <FormControl sx={{ width: "15%" }}>
                <InputLabel>Selecciona una categoría</InputLabel>
                <Select value={selectedCategory}
                    onChange={handleCategoryChange}
                    label="Selecciona una categoría">

                    {CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value}
                            value={cat.value}>
                            {cat.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <AutoCompleteSearch
                    label="Buscar..."
                    options={options}
                    value={autocompleteValue}
                    onChange={(newValue) => setAutocompleteValue(newValue ?? [])} />

                <IconButton sx={{ ml: 2 }} onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AutocompleteSelect;
