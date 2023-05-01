import { HomePage } from './pages/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

console.log('me jodieron')
  return (
      <Router>
        <Routes>
        <Route path='/' element={ <HomePage /> } />
        </Routes>
      </Router>
  );
}

export default App;
