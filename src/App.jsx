import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import './App.css';

// Lazy load components for code splitting
const Home = lazy(() => import('./components/Home/Home.jsx'));
const AboutUs = lazy(() => import('./components/AboutUs/AboutUs.jsx'));
const ContactUs = lazy(() => import('./components/ContactUs/ContactUs.jsx'));
const Advisor = lazy(() => import('./components/Advisor/Advisor.jsx'));
const Plans = lazy(() => import('./components/Home/Home.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard.jsx'));

// Loading component
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main style={{ paddingTop: '80px' }}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/advisor" element={<Advisor />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
