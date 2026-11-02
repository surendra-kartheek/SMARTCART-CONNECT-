import { ArrowUpDown, SearchX, SlidersHorizontal } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import NearbyStoresMap from '../components/NearbyStoresMap.jsx';
import { localities, stores } from '../data/stores.js';

export default function CustomerDashboard({ products, locality, onLocalityChange, listIds, onToggleSave }) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? 'All categories';
  const sort = params.get('sort') ?? 'relevance';
  const activeLocality = params.get('locality') ?? locality;

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    const result = products.filter((product) => {
      const textMatches = !term || [product.name, product.brand, product.variant, product.category].some((value) => String(value).toLocaleLowerCase().includes(term));
      const categoryMatches = category === 'All categories' || product.category === category;
      const store = stores.find((item) => item.id === product.storeId);
      const localityMatches = activeLocality === 'All localities' || !localities.includes(activeLocality) || store?.locality === activeLocality;
      return textMatches && categoryMatches && localityMatches;
    });
    if (sort === 'price-low') result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-high') result.sort((a, b) => Number(b.price) - Number(a.price));
    return result;
  }, [products, query, category, sort, activeLocality]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'All categories' || value === 'All localities' || value === 'relevance') next.delete(key);
    else next.set(key, value);
    setParams(next);
  };
  const updateMapLocality = (value) => {
    onLocalityChange(value);
    update('locality', value);
  };
  const matchingProducts = [...new Map(filtered.map((product) => [`${product.name}|${product.brand}|${product.quantity}|${product.variant}`, product])).values()];

  return (
    <main className="page-shell">
      <div className="page-title-row">
        <div><span className="eyebrow">Your neighborhood, at a glance</span><h1>Explore local products</h1><p>Browse seller-updated demo listings and compare exact product variants.</p></div>
        <span className="demo-pill"><span className="live-dot" /> DEMO INVENTORY</span>
      </div>
      <div className="explore-toolbar">
        <div className="filter-field"><SlidersHorizontal size={16} /><label htmlFor="explore-category">Category</label><select id="explore-category" value={category} onChange={(event) => update('category', event.target.value)}>
          <option>All categories</option>{[...new Set(products.map((product) => product.category))].map((item) => <option key={item}>{item}</option>)}
        </select></div>
        <div className="filter-field"><label htmlFor="explore-locality">Locality</label><select id="explore-locality" value={activeLocality} onChange={(event) => update('locality', event.target.value)}>
          <option>All localities</option>{localities.map((place) => <option key={place}>{place}</option>)}
        </select></div>
        <div className="filter-field"><ArrowUpDown size={16} /><label htmlFor="sort-products">Sort</label><select id="sort-products" value={sort} onChange={(event) => update('sort', event.target.value)}>
          <option value="relevance">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
        </select></div>
      </div>
      <div className="results-bar"><p><strong>{filtered.length}</strong> sample listings <span>·</span> <strong>{matchingProducts.length}</strong> distinct product variants</p>{query && <button className="clear-filter" onClick={() => update('q', '')}>Clear “{query}”</button>}</div>
      {filtered.length ? <div className="product-grid explore-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} isSaved={listIds.includes(product.id)} onToggleSave={onToggleSave} />)}</div> : (
        <div className="empty-state empty-results"><span className="empty-icon"><SearchX size={25} /></span><h2>No products found</h2><p>Try a different search or clear the filters to see all demo listings.</p><Link className="button button-outline" to="/explore">Show all products</Link></div>
      )}
      <NearbyStoresMap products={products} locality={activeLocality} onLocalityChange={updateMapLocality} />
    </main>
  );
}
