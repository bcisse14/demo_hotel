import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './index.css';

import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Reservation from './pages/Reservation';
import About from './pages/About';
import Contact from './pages/Contact';

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="lux-header sticky top-0 z-40">
        <div className="container-px mx-auto py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl site-title" style={{color:'#fff'}} onClick={closeMenu}>Maison Azur</Link>
          {/* Desktop nav */}
          <nav className="desktop-nav flex gap-4 text-sm">
            <NavLink to="/" onClick={closeMenu} className={({isActive}) => `nav-link ${isActive? 'nav-link-active':''}`}>Accueil</NavLink>
            <NavLink to="/chambres" onClick={closeMenu} className={({isActive}) => `nav-link ${isActive? 'nav-link-active':''}`}>Chambres</NavLink>
            <NavLink to="/reservation" onClick={closeMenu} className={({isActive}) => `nav-link ${isActive? 'nav-link-active':''}`}>Réserver</NavLink>
            <NavLink to="/contact" onClick={closeMenu} className={({isActive}) => `nav-link ${isActive? 'nav-link-active':''}`}>Contact</NavLink>
          </nav>
          {/* Mobile hamburger */}
          <button
            className={`mobile-nav-toggle ${menuOpen ? 'open' : ''}`}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span className="hamburger" />
          </button>
        </div>
        {/* Mobile menu */}
        <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({isActive}) => `mobile-link ${isActive? 'mobile-link-active':''}`}>Accueil</NavLink>
          <NavLink to="/chambres" onClick={closeMenu} className={({isActive}) => `mobile-link ${isActive? 'mobile-link-active':''}`}>Chambres</NavLink>
          <NavLink to="/reservation" onClick={closeMenu} className={({isActive}) => `mobile-link ${isActive? 'mobile-link-active':''}`}>Réserver</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={({isActive}) => `mobile-link ${isActive? 'mobile-link-active':''}`}>Contact</NavLink>
        </div>
        <div className="gold-divider" />
      </header>
      <main className="flex-1">{children}</main>
      <footer style={{background:'var(--footer-bg)'}}>
        <div className="container-px mx-auto py-8 text-sm flex justify-between items-center" style={{color:'var(--footer-ink)'}}>
          <span>© 2025 Karlsefni</span>
          <a href="https://bafode-cisse.vercel.app/" target="_blank" rel="noreferrer" className="font-medium hover:text-[color:var(--color-primary)]" style={{color:'var(--footer-ink)'}}>bafode-cisse.vercel.app</a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Helmet>
        <title>Maison Azur — Hôtel & Chambres d’hôtes</title>
        <meta name="description" content="Réservez en direct: suites, chambres familiales et standard. Vue mer, climatisation, WiFi. Meilleur prix garanti." />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chambres" element={<Rooms />} />
            <Route path="/chambres/:id" element={<RoomDetails />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}
