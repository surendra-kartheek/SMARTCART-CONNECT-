import React from 'react';
import { AlertTriangle, ArrowUpRight, CirclePlus, Pencil, PackageOpen, Store, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stores } from '../data/stores.js';

export default function SellerDashboard({ products, onDeleteProduct }) {
  const inStockCount = products.filter((product) => Number(product.stock) > 0).length;
  const discountedCount = products.filter((product) => Number(product.discount) > 0).length;

  return (
    <main className="page-shell seller-page">
      <div className="seller-welcome">
        <div><span className="eyebrow">Seller studio · Demo mode</span><h1>Your neighborhood shop,<br />all in one place.</h1><p>Manage your sample listings and keep your product details up to date for local shoppers.</p></div>
        <div className="seller-welcome-icon"><Store size={42} strokeWidth={1.4} /></div>
      </div>
      <div className="seller-disclaimer"><AlertTriangle size={17} /><span>This is a local demo dashboard. Changes are saved in this browser only and are not published to a real marketplace.</span></div>
      <div className="seller-stat-grid">
        <div className="seller-stat"><span>Product listings</span><strong>{products.length}</strong><small>Across {stores.length} sample stores</small></div>
        <div className="seller-stat"><span>Reported in stock</span><strong>{inStockCount}</strong><small>Seller-entered demo quantity</small></div>
        <div className="seller-stat"><span>Active sample offers</span><strong>{discountedCount}</strong><small>Discounts shown on listings</small></div>
      </div>
      <div className="seller-list-heading"><div><span className="eyebrow">Keep your catalog tidy</span><h2>Product listings</h2></div><Link to="/seller/products/new" className="button button-dark"><CirclePlus size={17} /> Add a product</Link></div>
      {products.length ? (
        <div className="seller-table-wrap">
          <table className="seller-table"><thead><tr><th>Product</th><th>Store</th><th>Price</th><th>Stock</th><th>Offer</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{products.map((product) => {
              const store = stores.find((item) => item.id === product.storeId);
              return <tr key={product.id}>
                <td><div className="seller-product-cell"><img src={product.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/product-fallback.svg'; }} /><span><strong>{product.name}</strong><small>{product.brand} · {product.quantity} · {product.variant}</small></span></div></td>
                <td><span className="seller-store-name">{store?.name ?? 'Unknown store'}</span><small className="table-subtext">{store?.locality ?? '—'}</small></td>
                <td><strong>₹{Number(product.price).toLocaleString('en-IN')}</strong></td>
                <td><span className={`stock-label ${product.stock > 0 ? 'stock-label-in' : 'stock-label-out'}`}>{product.stock > 0 ? `${product.stock} units` : 'Out of stock'}</span></td>
                <td>{product.discount > 0 ? `${product.discount}% off` : '—'}</td>
                <td><div className="table-actions"><Link to={`/seller/products/${product.id}/edit`} className="table-icon" title={`Edit ${product.name}`} aria-label={`Edit ${product.name}`}><Pencil size={16} /></Link><button className="table-icon delete-action" onClick={() => onDeleteProduct(product)} title={`Delete ${product.name}`} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button><Link to={`/products/${product.id}`} className="table-icon" title="View listing" aria-label="View listing"><ArrowUpRight size={16} /></Link></div></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      ) : <div className="empty-state"><PackageOpen size={28} /><h2>No listings yet</h2><p>Add your first product to see it in the seller catalog.</p><Link to="/seller/products/new" className="button button-dark">Add a product</Link></div>}
      <p className="seller-storage-note">Your changes are stored in localStorage. Clearing browser data resets the demo catalog.</p>
    </main>
  );
}
