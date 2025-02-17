
export async function ListCountries(): Promise<string[]> {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) 
        throw new Error("Error al obtener los países");

    const data = await response.json();
    return data.map((
        country: {
             name: { common: string }
             }) => country.name.common);

  } catch (error) {

    console.error("Error en Generar todo los paises:", error);
    alert("Error en Generar todo los paises:");
    return [];
  }
}
