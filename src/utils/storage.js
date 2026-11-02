import { initialProducts } from '../data/products.js';

const keys = {
  products: 'smartcart-demo-products',
  shoppingList: 'smartcart-shopping-list',
};

function read(key, fallback) {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(`Ignoring invalid saved demo data for "${key}".`);
      return fallback;
    }
    throw error;
  }
}

export const loadProducts = () => {
  const products = read(keys.products, initialProducts);
  return Array.isArray(products) ? products : initialProducts;
};

export const saveProducts = (products) => window.localStorage.setItem(keys.products, JSON.stringify(products));
export const loadShoppingList = () => {
  const list = read(keys.shoppingList, []);
  return Array.isArray(list) ? list : [];
};
export const saveShoppingList = (list) => window.localStorage.setItem(keys.shoppingList, JSON.stringify(list));
