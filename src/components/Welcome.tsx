import { Typography, Button, Box } from '@mui/material';
import imgbg from '../assets/img/homebg.jpg';
import  {useCallback}  from 'react';

export default function Welcome() {
    const scrollToSearch = useCallback(() => {
        const searchSection = document.getElementById('search');
        if (searchSection) {
                // desplaza al otro componente de manera suave
            searchSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                width: '95vw',
                minHeight: '95vh',
                backgroundImage: `url(${imgbg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
                textAlign: 'center',
                overflow: 'hidden',
            }}
        >
            <Box>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                    ¿Algún destino en mente? 🌍✈️
                </Typography>
                <Button variant="contained" color="success" onClick={scrollToSearch}>
                    Explorar
                </Button>
            </Box>
        </Box>
    );
}