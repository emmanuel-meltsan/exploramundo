export async function ListLanguage(): Promise<string[]> {
    try {
  
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) 
        throw new Error("Error al obtener los datos");
      
      const data = await response.json();
      const languagesSet = new Set<string>();
  
      data.forEach((country: { languages?: Record<string, string> }) => {
  
        Object.values(country.languages || {})
                    .forEach(lang => languagesSet.add(lang));
  
      });
      return Array.from(languagesSet);
    } catch (error) {
      console.error("❌ Error al generar la lista de idiomas:", error);
      return [];
    }
    
  }
  