import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <a className="brand footer-brand" href="/">
            <span className="brand-mark"><MapPin size={20} /></span>
            <span className="brand-name">smartcart<span>connect</span></span>
          </a>
          <p>Find nearby. Compare prices. Shop smarter.</p>
        </div>
        <div className="demo-footnote"><ShieldCheck size={17} /> Demo listings only · Please confirm price and stock with the seller.</div>
        <span className="copyright">© {new Date().getFullYear()} SmartCart Connect</span>
      </div>
    </footer>
  );
}
