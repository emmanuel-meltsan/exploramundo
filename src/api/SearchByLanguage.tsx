
interface CountryData {
    flag: string;
    name: string;
    capital: string;
    language: string;
  }
  
  // Función para obtener países por idioma
  const fetchCountriesByLanguage = async (language: string): Promise<CountryData[]> => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/lang/${language}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - No se encontraron países para el idioma: ${language}`);
      }
  
      const data = await response.json();
  
      // Mapear los datos a un formato más claro
      return data.map((country: any) => ({
        flag: country.flag ?? "🏳️", // Usa el emoji de bandera si está disponible
        name: country.name.common ?? "Desconocido",
        capital: country.capital?.[0] ?? "No disponible",
        language: Object.values(country.languages ?? {})[0] ?? "Desconocido",
      }));
  
    } catch (error) {
      console.error("Error al obtener los países:", error);
      return [];
    }
  };
  
  export default fetchCountriesByLanguage;
  