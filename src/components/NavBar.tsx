import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ThemeSwitch from './switchThemeBttn'


const pages = [
  { name: 'Inicio', path: '/' },
  { name: 'País Vs País', path: '/pais-vs-pais' }
];

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const navigate = useNavigate(); // Hook para redirigir

  return (
    <AppBar position="fixed">
      <Container maxWidth={false}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => navigate(page.path)} // Redirigir al hacer clic
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <ThemeSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
