import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ShoppingList from './pages/ShoppingList.jsx';
import NotFound from './pages/NotFound.jsx';
import { localities } from './data/stores.js';
import { loadProducts, loadShoppingList, saveProducts, saveShoppingList } from './utils/storage.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [products, setProducts] = useState(loadProducts);
  const [listIds, setListIds] = useState(loadShoppingList);
  const [locality, setLocality] = useState(() => {
    const savedLocality = window.localStorage.getItem('smartcart-locality');
    return localities.includes(savedLocality) ? savedLocality : 'Koramangala';
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const chooseLocality = (value) => {
    setLocality(value);
    try {
      window.localStorage.setItem('smartcart-locality', value);
    } catch (error) {
      setToast(`Locality preference could not be saved: ${error.message}`);
    }
  };

  const toggleSave = (id) => {
    const next = listIds.includes(id) ? listIds.filter((savedId) => savedId !== id) : [...listIds, id];
    try {
      saveShoppingList(next);
      setListIds(next);
      setToast(next.includes(id) ? 'Added to your shopping list.' : 'Removed from your shopping list.');
    } catch (error) {
      setToast(`Could not update your shopping list: ${error.message}`);
    }
  };

  const clearList = () => {
    try {
      saveShoppingList([]);
      setListIds([]);
      setToast('Shopping list cleared.');
    } catch (error) {
      setToast(`Could not clear the shopping list: ${error.message}`);
    }
  };

  const saveProduct = (product) => {
    const next = products.some((item) => item.id === product.id)
      ? products.map((item) => item.id === product.id ? product : item)
      : [product, ...products];
    try {
      saveProducts(next);
      setProducts(next);
      return true;
    } catch (error) {
      setToast(`Could not save product: ${error.message}`);
      return false;
    }
  };

  const deleteProduct = (product) => {
    if (!window.confirm(`Delete "${product.name}" from the demo catalog?`)) return;
    const next = products.filter((item) => item.id !== product.id);
    try {
      saveProducts(next);
      setProducts(next);
      const nextList = listIds.filter((id) => id !== product.id);
      saveShoppingList(nextList);
      setListIds(nextList);
      setToast('Demo listing deleted.');
    } catch (error) {
      setToast(`Could not delete listing: ${error.message}`);
    }
  };

  const reserveProduct = (product, store) => {
    setToast(`Demo request noted for ${product.name} at ${store?.name ?? 'this store'}. Contact the seller to confirm.`);
  };

  return (
    <div className="app-shell">
      <ScrollToTop />
      <div className="demo-banner"><span className="demo-banner-dot" /> DEMO EXPERIENCE <span>Sample inventory only · Not verified real-time availability</span></div>
      <Navbar locality={locality} onLocalityChange={chooseLocality} localities={localities} listCount={listIds.length} />
      <Routes>
        <Route path="/" element={<Home products={products} locality={locality} onLocalityChange={chooseLocality} listIds={listIds} onToggleSave={toggleSave} />} />
        <Route path="/explore" element={<CustomerDashboard products={products} locality={locality} onLocalityChange={chooseLocality} listIds={listIds} onToggleSave={toggleSave} />} />
        <Route path="/products/:id" element={<ProductDetails products={products} listIds={listIds} onToggleSave={toggleSave} onReserve={reserveProduct} />} />
        <Route path="/seller" element={<SellerDashboard products={products} onDeleteProduct={deleteProduct} />} />
        <Route path="/seller/products/new" element={<AddProduct products={products} onSaveProduct={saveProduct} />} />
        <Route path="/seller/products/:id/edit" element={<AddProduct products={products} onSaveProduct={saveProduct} />} />
        <Route path="/shopping-list" element={<ShoppingList products={products} listIds={listIds} onToggleSave={toggleSave} onClearList={clearList} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}
