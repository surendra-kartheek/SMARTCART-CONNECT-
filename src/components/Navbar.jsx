import { Link, NavLink } from 'react-router-dom';
import { MapPin, Menu, ShoppingBag, X } from 'lucide-react';
import React, { useState } from 'react';

export default function Navbar({ locality, onLocalityChange, localities, listCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="SmartCart Connect home">
          <span className="brand-mark"><ShoppingBag size={21} strokeWidth={2.2} /></span>
          <span className="brand-name">smartcart<span>connect</span></span>
        </Link>
        <button className="icon-button mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/explore" onClick={closeMenu}>Explore products</NavLink>
          <NavLink to="/#categories" onClick={closeMenu}>Categories</NavLink>
          <NavLink to="/shopping-list" onClick={closeMenu} className="nav-list-link">
            Shopping list <span className="nav-count">{listCount}</span>
          </NavLink>
          <NavLink to="/seller" onClick={closeMenu}>Seller dashboard</NavLink>
        </nav>
        <label className="location-picker">
          <MapPin size={16} aria-hidden="true" />
          <span className="sr-only">Choose demo locality</span>
          <select value={locality} onChange={(event) => onLocalityChange(event.target.value)} aria-label="Choose demo locality">
            <option value="All localities">All localities</option>
            {localities.map((place) => <option key={place} value={place}>{place}</option>)}
          </select>
        </label>
      </div>
    </header>
  );
}
