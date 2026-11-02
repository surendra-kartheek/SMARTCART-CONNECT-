import React from 'react';
import { ArrowLeft, Heart, MapPin, MessageCircle, PackageCheck, Phone, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PriceComparison from '../components/PriceComparison.jsx';
import { productMatchKey } from '../data/products.js';
import { stores } from '../data/stores.js';
import { getWhatsAppLink } from '../utils/whatsapp.js';

const updatedLabel = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Seller update time unavailable' : `Updated ${date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`;
};

export default function ProductDetails({ products, listIds, onToggleSave, onReserve }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  if (!product) return <main className="page-shell"><div className="empty-state"><h1>Product not found</h1><p>This listing may have been removed.</p><Link to="/explore" className="button button-dark">Back to products</Link></div></main>;
  const store = stores.find((item) => item.id === product.storeId);
  const comparisons = products.filter((item) => productMatchKey(item) === productMatchKey(product));
  const whatsApp = store && getWhatsAppLink(store.phone, `Hi ${store.name}, could you confirm ${product.name} (${product.brand}, ${product.quantity}, ${product.variant}) at ₹${product.price} and current stock?`);
  const isSaved = listIds.includes(product.id);

  return (
    <main className="page-shell detail-shell">
      <Link to="/explore" className="back-link"><ArrowLeft size={16} /> Back to explore</Link>
      <div className="detail-layout">
        <div className="detail-image-wrap"><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/product-fallback.svg'; }} />{product.discount > 0 && <span className="discount-tag detail-discount">{product.discount}% off</span>}</div>
        <section className="detail-info">
          <div className="detail-category">{product.category} <span>·</span> Demo listing</div>
          <h1>{product.name}</h1>
          <p className="detail-specs">{product.brand} <span>·</span> {product.quantity} <span>·</span> {product.variant}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price-row"><strong>₹{Number(product.price).toLocaleString('en-IN')}</strong>{product.discount > 0 && <span>{product.discount}% sample offer</span>}</div>
          <div className="detail-stock"><PackageCheck size={17} /><span className={product.stock ? 'text-green' : 'text-red'}>{product.stock > 0 ? `${product.stock} units reported in stock` : 'Currently marked out of stock'}</span><small>{updatedLabel(product.updatedAt)}</small></div>
          <div className="detail-store-card">
            <div className="store-avatar">{store?.name.split(' ').map((word) => word[0]).slice(0, 2).join('') ?? 'SC'}</div>
            <div><strong>{store?.name ?? 'Demo store'}</strong><span><MapPin size={13} /> {store?.locality ?? 'Locality unavailable'}</span></div>
          </div>
          <div className="detail-actions">
            <button className={`button ${isSaved ? 'button-outline' : 'button-dark'}`} onClick={() => onToggleSave(product.id)}><Heart size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved to list' : 'Add to shopping list'}</button>
            {whatsApp && <a className="button button-whatsapp" href={whatsApp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp seller</a>}
            {store?.phone && <a className="button button-outline" href={`tel:+${store.phone}`}><Phone size={15} /> Call store</a>}
          </div>
          <div className="reservation-callout"><ShieldCheck size={16} /><span>Prices and stock are illustrative seller-updated demo data. Confirm with the store before visiting.</span></div>
        </section>
      </div>
      <PriceComparison products={comparisons} onReserve={onReserve} />
    </main>
  );
}
