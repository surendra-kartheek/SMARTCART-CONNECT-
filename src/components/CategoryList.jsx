import React from 'react';
import { ArrowUpRight, Grid2X2, Gem, House, Salad, Shirt, ShoppingBasket, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const icons = { Grid2X2, ShoppingBasket, Salad, Shirt, Smartphone, House, Gem };
const colors = ['mint', 'peach', 'lime', 'lavender', 'blue', 'sand'];

export default function CategoryList() {
  return (
    <div className="category-grid">
      {[
        ['Groceries', 'Everyday pantry finds', 'ShoppingBasket'],
        ['Fruits & vegetables', 'Fresh picks nearby', 'Salad'],
        ['Fashion', 'Style from local shops', 'Shirt'],
        ['Electronics', 'Useful tech & accessories', 'Smartphone'],
        ['Household', 'Make home feel good', 'House'],
        ['Jewellery', 'Little details, local finds', 'Gem'],
      ].map(([name, description, icon], index) => {
        const Icon = icons[icon];
        return (
          <Link to={`/explore?category=${encodeURIComponent(name)}`} className="category-tile" key={name}>
            <span className={`category-icon ${colors[index]}`}><Icon size={22} strokeWidth={1.8} /></span>
            <span><strong>{name}</strong><small>{description}</small></span>
            <ArrowUpRight size={16} className="category-arrow" />
          </Link>
        );
      })}
    </div>
  );
}
