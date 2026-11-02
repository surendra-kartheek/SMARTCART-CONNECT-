import React from 'react';
import { ArrowRight, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';

export default function ShoppingList({ products, listIds, onToggleSave, onClearList }) {
  const saved = listIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  return (
    <main className="page-shell">
      <div className="page-title-row">
        <div><span className="eyebrow">Keep your next shop in mind</span><h1>Shopping list</h1><p>Your saved demo listings stay in this browser on this device.</p></div>
        {saved.length > 0 && <button className="button button-outline" onClick={onClearList}><Trash2 size={15} /> Clear list</button>}
      </div>
      {saved.length ? <div className="product-grid explore-grid">{saved.map((product) => <ProductCard key={product.id} product={product} isSaved onToggleSave={onToggleSave} />)}</div> : (
        <div className="empty-state empty-results"><span className="empty-icon"><Heart size={24} /></span><h2>Your list is ready for ideas</h2><p>Save a product from Explore or its detail page to keep it here.</p><Link className="button button-dark" to="/explore">Explore products <ArrowRight size={16} /></Link></div>
      )}
    </main>
  );
}
