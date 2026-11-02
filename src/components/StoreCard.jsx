import React from 'react';
import { ArrowUpRight, MapPin, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWhatsAppLink } from '../utils/whatsapp.js';

export default function StoreCard({ store, productCount = 0 }) {
  const contactUrl = getWhatsAppLink(store.phone, `Hi ${store.name}, I found your demo listing on SmartCart Connect. Could you confirm today's price and stock?`);
  return (
    <article className="store-card">
      <div className="store-avatar">{store.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
      <div className="store-content">
        <div className="store-name-row"><h3>{store.name}</h3><span className="rating"><Star size={13} fill="currentColor" /> {store.rating}</span></div>
        <p>{store.note}</p>
        <div className="store-location"><MapPin size={14} /> {store.locality} <span className="store-separator">·</span> {productCount} sample listings</div>
        <div className="store-actions">
          <Link to={`/explore?locality=${encodeURIComponent(store.locality)}`} className="text-link">Explore listings <ArrowUpRight size={14} /></Link>
          <a className="store-contact" href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={14} /> Contact</a>
        </div>
      </div>
    </article>
  );
}
