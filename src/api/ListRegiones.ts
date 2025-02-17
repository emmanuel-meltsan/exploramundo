export async function ListRegiones(): Promise<string[]> {

    try {

        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const regionsSet: Set<string> = new Set();

        data.forEach((
            country: 
            { 
                region: string 
            }) => {
            regionsSet.add(country.region); 
        });

        return Array.from(regionsSet);
    } catch (error) {
        console.error("Error en Generar todo las regiones:", error);
        alert("Error en Generar todo las regiones:");
        return [];
    }
}
