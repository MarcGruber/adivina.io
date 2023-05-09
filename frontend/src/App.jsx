import { HomePage } from './pages/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FooterApp } from './components/footer';

function App() {

  return (
      <Router>
        <header>
          <a href="https://github.com/MarcGruber/adivina.io">Ver Codigo</a>
        </header>
        <Routes>
        <Route path='/' element={ <HomePage /> } />
        </Routes>
        <FooterApp />
      </Router>
  );
}

export default App;