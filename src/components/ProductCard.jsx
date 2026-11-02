import React from 'react';
import { ArrowUpRight, Heart, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stores } from '../data/stores.js';

export default function ProductCard({ product, isSaved, onToggleSave }) {
  const store = stores.find((item) => item.id === product.storeId);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt="" className="product-image" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/product-fallback.svg'; }} />
        {product.discount > 0 && <span className="discount-tag"><Tag size={12} /> {product.discount}% off</span>}
        <button
          className={`save-product ${isSaved ? 'is-saved' : ''}`}
          onClick={() => onToggleSave(product.id)}
          aria-label={isSaved ? `Remove ${product.name} from shopping list` : `Add ${product.name} to shopping list`}
          title={isSaved ? 'Remove from shopping list' : 'Add to shopping list'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-meta"><span>{product.category}</span><span className={`stock-dot ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span></div>
        <Link to={`/products/${product.id}`} className="product-title-link"><h3>{product.name}</h3></Link>
        <p className="product-variant">{product.brand} <span>·</span> {product.quantity} <span>·</span> {product.variant}</p>
        <div className="product-price-row">
          <strong>₹{Number(product.price).toLocaleString('en-IN')}</strong>
          {product.discount > 0 && <span className="discount-copy">{product.discount}% off</span>}
        </div>
        <div className="product-card-bottom">
          <span className="store-caption">{store?.name ?? 'Demo store'} · {store?.locality ?? 'Locality unavailable'}</span>
          <Link className="round-arrow" to={`/products/${product.id}`} aria-label={`View ${product.name} details`}><ArrowUpRight size={17} /></Link>
        </div>
      </div>
    </article>
  );
}
