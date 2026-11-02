import { ArrowRight, ArrowUpRight, BadgeCheck, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryList from '../components/CategoryList.jsx';
import StoreCard from '../components/StoreCard.jsx';
import { stores } from '../data/stores.js';
import { productMatchKey } from '../data/products.js';

export default function Home({ products, locality, onLocalityChange, listIds, onToggleSave }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const featured = useMemo(() => {
    const seen = new Set();
    return products.filter((product) => {
      const key = productMatchKey(product);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);
  }, [products]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'All categories') params.set('category', category);
    if (locality !== 'All localities') params.set('locality', locality);
    navigate(`/explore${params.size ? `?${params}` : ''}`);
  };

  const nearbyStores = stores.filter((store) => locality === 'All localities' || store.locality === locality).slice(0, 3);
  const localityCount = locality === 'All localities' ? stores.length : nearbyStores.length;

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-dot" /> LOCAL SHOPPING, MADE SIMPLE</div>
          <h1>Good finds are<br />closer than <span>you think.</span></h1>
          <p>Discover what nearby independent stores have in stock. Compare like-for-like prices, then connect before you head out.</p>
          <SearchBar query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory} onSubmit={handleSearch} />
          <div className="hero-trust"><span><MapPin size={15} /> {localityCount} demo stores</span><span><ShieldCheck size={15} /> Seller-updated listings</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=90" alt="Colorful fresh produce in a local market" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/product-fallback.svg'; }} />
            <div className="photo-caption"><span className="caption-icon"><Sparkles size={16} /></span><span><strong>Shop around the corner</strong><small>Local stores. More choice.</small></span><ArrowUpRight size={17} /></div>
          </div>
          <div className="hero-price-note"><span className="price-note-icon">₹</span><span><strong>Compare before you go</strong><small>One quick check can help you save.</small></span></div>
          <div className="hero-sticker"><BadgeCheck size={16} /> LOCAL FIRST</div>
        </div>
        <div className="hero-outline" aria-hidden="true" />
      </section>

      <main>
        <section className="section-block section-categories" id="categories">
          <div className="section-heading">
            <div><span className="eyebrow">A little bit of everything</span><h2>Explore by category</h2></div>
            <Link to="/explore" className="text-link">Browse everything <ArrowRight size={15} /></Link>
          </div>
          <CategoryList />
        </section>

        <section className="section-block featured-section">
          <div className="section-heading">
            <div><span className="eyebrow">Worth a closer look</span><h2>Popular local finds</h2></div>
            <Link to="/explore" className="text-link">See all products <ArrowRight size={15} /></Link>
          </div>
          {featured.length ? (
            <div className="product-grid">
              {featured.map((product) => <ProductCard key={product.id} product={product} isSaved={listIds.includes(product.id)} onToggleSave={onToggleSave} />)}
            </div>
          ) : <div className="empty-state"><p>No demo products yet. Visit the seller dashboard to add a listing.</p><Link className="button button-outline" to="/seller">Open seller dashboard</Link></div>}
        </section>

        <section className="local-stores-section">
          <div className="section-heading">
            <div><span className="eyebrow">The people behind the shelves</span><h2>Meet local demo stores</h2></div>
            <label className="inline-location"><MapPin size={15} /><select value={locality} onChange={(event) => onLocalityChange(event.target.value)} aria-label="Filter stores by locality">
              <option value="All localities">All localities</option>
              {[...new Set(stores.map((store) => store.locality))].map((place) => <option key={place}>{place}</option>)}
            </select></label>
          </div>
          <div className="store-grid">
            {nearbyStores.length ? nearbyStores.map((store) => <StoreCard key={store.id} store={store} productCount={products.filter((product) => product.storeId === store.id).length} />) : <p className="empty-copy">No sample stores for this locality.</p>}
          </div>
          <p className="demo-disclaimer"><ShieldCheck size={15} /> Store names, ratings, prices and inventory on this site are illustrative demo data. They are not verified real businesses.</p>
        </section>

        <section className="seller-cta">
          <div><span className="eyebrow">For neighborhood businesses</span><h2>Your shop deserves to be found.</h2><p>Keep sample listings up to date and help nearby shoppers plan their next visit.</p></div>
          <Link to="/seller" className="button button-dark">Visit seller dashboard <ArrowRight size={16} /></Link>
        </section>
      </main>
    </>
  );
}
