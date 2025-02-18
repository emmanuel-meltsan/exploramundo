import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fontsource/roboto/300.css'; 
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './components/ThemeMode.tsx';
import Navbar from './components/NavBar.tsx';
import Inicio from './pages/Inicio.tsx';
import PaisVsPais from './pages/PaisVsPais.tsx';
import CountryInfo from './pages/CountryInfo.tsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />            
      <Routes>
              <Route path="/" element={<Inicio/>} />
              <Route path="/pais-vs-pais" element={<PaisVsPais />} />
              <Route path="/country/:countryName" element={<CountryInfo />} />
              </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
