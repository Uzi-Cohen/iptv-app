import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components';
import { HomePage, ChannelsPage, MoviesPage, SeriesPage, LoginPage, ExtractorPage } from './pages';
import { XtreamProvider } from './context/XtreamContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';

  return (
    <div className="app">
      {!hideNav && <Navigation />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/extractor" element={<ExtractorPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <XtreamProvider>
      <Router>
        <AppContent />
      </Router>
    </XtreamProvider>
  );
}

export default App;
