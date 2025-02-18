import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { CountryDetails } from '../types/CountryDetails';



/* cada carta debe tener
* bandera emoji
* nombre del pais
* region
* subregion
* capital
* idioma

*/



const CountryCart: React.FC<CountryDetails> = ({ flag, countryName, capital, region, subregion, languages }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/country/${encodeURIComponent(countryName)}`);
    };

    return (
        <Paper elevation={3} 
                sx={{ 
                    padding: 2,
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center' }}
                    onClick={handleClick}
                >

            <Typography variant="h4">{flag}</Typography>

            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                {countryName}
            </Typography>

            <Typography variant="body1" color="text.secondary">
                Capital: {capital}
            </Typography>

            <Typography variant="body1" color="text.secondary">
                Región: {region}
            </Typography>

            <Typography variant="body1" color="text.secondary">
                Subregión: {subregion}
            </Typography>

            <Typography variant="body2" color="text.secondary">
                Idioma(s): {languages.join(", ")}
            </Typography>
                <Typography variant="body2" color="text.secondary">
                
      <Link component={RouterLink} to={`/country/${encodeURIComponent(countryName)}`} variant="body2">
        Ver más: aquí
      </Link>

                </Typography>
        </Paper>
    );
};

export default CountryCart;
