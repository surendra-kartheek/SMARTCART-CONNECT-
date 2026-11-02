import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productCategories } from '../data/categories.js';
import { stores } from '../data/stores.js';

const blankForm = {
  name: '', category: 'Groceries', brand: '', quantity: '', variant: '', storeId: stores[0].id,
  price: '', stock: '0', discount: '0', image: '', description: '',
};

export default function AddProduct({ products, onSaveProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const current = id ? products.find((item) => item.id === id) : null;
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    if (current) setForm({ ...blankForm, ...current, price: String(current.price), stock: String(current.stock), discount: String(current.discount) });
  }, [current]);

  if (isEditing && !current) return <main className="page-shell"><div className="empty-state"><h1>Listing not found</h1><p>This product may have already been removed.</p><Link to="/seller" className="button button-dark">Back to seller dashboard</Link></div></main>;

  const setField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: '' }));
    setSaveError('');
  };

  const validate = () => {
    const next = {};
    for (const field of ['name', 'brand', 'quantity', 'variant']) {
      if (!String(form[field]).trim()) next[field] = 'This field is required.';
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) next.price = 'Enter a price greater than zero.';
    if (!String(form.stock).trim() || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) next.stock = 'Enter a whole number of zero or more.';
    if (!Number.isFinite(Number(form.discount)) || Number(form.discount) < 0 || Number(form.discount) > 100) next.discount = 'Enter a discount between 0 and 100.';
    const localImagePath = form.image.startsWith('/') && !form.image.startsWith('//');
    if (form.image && !/^https?:\/\//i.test(form.image) && !localImagePath) next.image = 'Use an http(s) URL or a local path starting with one slash.';
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const saved = onSaveProduct({
      ...form,
      id: current?.id ?? `custom-${Date.now()}`,
      name: form.name.trim(), brand: form.brand.trim(), quantity: form.quantity.trim(), variant: form.variant.trim(),
      price: Number(form.price), stock: Number(form.stock), discount: Number(form.discount),
      image: form.image.trim() || current?.image || '/images/product-fallback.svg',
      description: form.description.trim() || `${form.name.trim()} demo listing.`,
      updatedAt: new Date().toISOString(),
    });
    if (!saved) {
      setSaveError('The listing could not be saved to this browser. Check available local storage and try again.');
      return;
    }
    navigate('/seller');
  };

  return (
    <main className="page-shell form-page">
      <Link to="/seller" className="back-link"><ArrowLeft size={16} /> Seller dashboard</Link>
      <div className="form-page-heading"><span className="eyebrow">Seller studio · Demo mode</span><h1>{isEditing ? 'Edit product listing' : 'Add a product'}</h1><p>Accurate variants help shoppers compare the right products.</p></div>
      <form className="product-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section-title"><span>01</span><div><h2>Product details</h2><p>Tell shoppers exactly what you have.</p></div></div>
        <div className="form-grid">
          <Field label="Product name" name="name" value={form.name} onChange={setField} error={errors.name} placeholder="e.g. Sona Masoori Rice" required />
          <label className="form-field"><span>Category <b>*</b></span><select value={form.category} onChange={(event) => setField('category', event.target.value)}>{productCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <Field label="Brand" name="brand" value={form.brand} onChange={setField} error={errors.brand} placeholder="e.g. Harvest Gold" required />
          <Field label="Package size / quantity" name="quantity" value={form.quantity} onChange={setField} error={errors.quantity} placeholder="e.g. 25 kg, 1 L, 1 piece" required />
          <Field label="Variant / specifications" name="variant" value={form.variant} onChange={setField} error={errors.variant} placeholder="e.g. Premium, raw" required />
          <label className="form-field"><span>Store and locality <b>*</b></span><select value={form.storeId} onChange={(event) => setField('storeId', event.target.value)}>{stores.map((store) => <option key={store.id} value={store.id}>{store.name} · {store.locality}</option>)}</select><small>Select one of the sample stores for this demo listing.</small></label>
          <Field label="Price (₹)" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={setField} error={errors.price} placeholder="0.00" required />
          <Field label="Stock quantity" name="stock" type="number" min="0" step="1" value={form.stock} onChange={setField} error={errors.stock} placeholder="0" required />
          <Field label="Discount (%)" name="discount" type="number" min="0" max="100" step="1" value={form.discount} onChange={setField} error={errors.discount} placeholder="0" />
          <Field label="Product image URL (optional)" name="image" value={form.image} onChange={setField} error={errors.image} placeholder="https://..." />
          <label className="form-field form-field-wide"><span>Description (optional)</span><textarea rows="4" value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Share a helpful product detail." /></label>
        </div>
        <div className="form-hint"><ImagePlus size={16} /> Demo entries only. Product name, brand, quantity and variant are all used for exact-match price comparison.</div>
        {saveError && <p className="form-save-error" role="alert">{saveError}</p>}
        <div className="form-actions"><Link to="/seller" className="button button-outline">Cancel</Link><button className="button button-dark" type="submit"><Save size={16} /> {isEditing ? 'Save changes' : 'Add demo listing'}</button></div>
      </form>
    </main>
  );
}

function Field({ label, name, value, onChange, error, required, type = 'text', ...inputProps }) {
  const errorId = `${name}-error`;
  return (
    <label className={`form-field ${error ? 'field-error' : ''}`}>
      <span>{label} {required && <b>*</b>}</span>
      <input type={type} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...inputProps} />
      {error && <small id={errorId} className="field-error-text">{error}</small>}
    </label>
  );
}
