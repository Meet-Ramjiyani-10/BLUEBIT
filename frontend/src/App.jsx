import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyzer" element={<Analyzer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
