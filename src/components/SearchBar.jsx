import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/categories.js';

export default function SearchBar({ query, onQueryChange, category, onCategoryChange, onSubmit, compact = false }) {
  return (
    <form className={`search-bar ${compact ? 'search-bar-compact' : ''}`} onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
      <Search size={20} className="search-icon" aria-hidden="true" />
      <label className="sr-only" htmlFor={compact ? 'product-search-compact' : 'product-search'}>Search products or brands</label>
      <input
        id={compact ? 'product-search-compact' : 'product-search'}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search rice, headphones, fresh produce..."
      />
      <label className="category-select-label">
        <SlidersHorizontal size={16} aria-hidden="true" />
        <span className="sr-only">Filter by category</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)} aria-label="Filter by category">
          {categories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </label>
      <button className="button button-dark search-submit" type="submit">Search</button>
    </form>
  );
}
