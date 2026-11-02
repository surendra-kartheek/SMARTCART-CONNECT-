import React from 'react';
import { CheckCircle2, Clock3, MapPin, MessageCircle, Phone, Tag } from 'lucide-react';
import { stores } from '../data/stores.js';
import { getWhatsAppLink } from '../utils/whatsapp.js';

const formatUpdated = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Time not provided' : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

export default function PriceComparison({ products, onReserve }) {
  if (!products.length) return <div className="empty-state compact-empty"><p>No matching listings are available to compare.</p></div>;
  const lowest = products.reduce((best, item) => Number(item.price) < Number(best.price) ? item : best);
  const sorted = [...products].sort((a, b) => Number(a.price) - Number(b.price));

  return (
    <div className="comparison-wrap">
      <div className="comparison-heading">
        <div><span className="eyebrow">Same product, local options</span><h2>Compare sample prices</h2></div>
        <span className="demo-pill">DEMO DATA</span>
      </div>
      <p className="comparison-intro">Only listings with the exact same name, brand, size and variant are grouped here.</p>
      <div className="comparison-table">
        <div className="comparison-table-head"><span>Store & locality</span><span>Price</span><span>Availability</span><span>Updated</span><span>Contact</span></div>
        {sorted.map((product) => {
          const store = stores.find((item) => item.id === product.storeId);
          const isLowest = product.id === lowest.id;
          const waLink = store ? getWhatsAppLink(store.phone, `Hi ${store.name}, could you confirm ${product.name} (${product.brand}, ${product.quantity}, ${product.variant}) at ₹${product.price} and current stock?`) : '';
          return (
            <div className={`comparison-row ${isLowest ? 'lowest-row' : ''}`} key={product.id}>
              <div className="comparison-store"><strong>{store?.name ?? 'Demo store'}</strong><span><MapPin size={13} /> {store?.locality ?? 'Unknown locality'}</span>{isLowest && <em><CheckCircle2 size={12} /> Lowest listed</em>}</div>
              <div className="comparison-price"><strong>₹{Number(product.price).toLocaleString('en-IN')}</strong>{product.discount > 0 && <span><Tag size={12} /> {product.discount}% off</span>}</div>
              <div><span className={`availability ${product.stock > 0 ? 'available' : 'unavailable'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span></div>
              <div className="updated-time"><Clock3 size={13} /> {formatUpdated(product.updatedAt)}</div>
              <div className="compare-actions">
                {waLink && <a className="compare-icon-action" href={waLink} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${store.name}`} title="WhatsApp seller"><MessageCircle size={17} /></a>}
                {store?.phone && <a className="compare-icon-action" href={`tel:+${store.phone}`} aria-label={`Call ${store.name}`} title="Call seller"><Phone size={16} /></a>}
                <button className="button button-outline button-small" onClick={() => onReserve(product, store)}>Reserve</button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="confirmation-note">Demo inventory is seller-updated, not live. Confirm final price, variant and availability directly with the seller before visiting.</p>
    </div>
  );
}
