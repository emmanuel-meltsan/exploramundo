
export async function ListSubregions(): Promise<string[]> {

    try {
        //1. hacer peticion a la API
        const response = await fetch('https://restcountries.com/v3.1/all');

        //2. recibir los datos y convertirlo en json
        const reciveData = await response.json();
        const subregionsSet: Set<string> = new Set();

        // 3. mapear los datos y almacenarlos ya limpios
        reciveData.forEach((country: { subregion: string }) => {
            if (country.subregion) {
                subregionsSet.add(country.subregion);
            }
        });
        // Convertir el Set a un arreglo y devolverlo
        return Array.from(subregionsSet);

    } catch (error) {
        console.error("Error en Generar todo las Sub-regiones:", error);
        alert("Error en Generar todo las Sub-regiones:");
        return [];
    }


}  