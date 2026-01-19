import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components';
import { HomePage, ChannelsPage, MoviesPage, SeriesPage } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/series" element={<SeriesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
