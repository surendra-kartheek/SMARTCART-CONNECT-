# SmartCart Connect

**Find Nearby. Compare Prices. Shop Smarter.**

SmartCart Connect is a responsive local-shopping demo connecting shoppers with sample neighborhood store listings. Customers can search and filter demo products, compare exact variants, save items, and contact a sample seller. Sellers can create and manage listings in a local demo dashboard.

> **Demo notice:** Store names, ratings, prices, offers, availability, timestamps, and contact numbers are illustrative. They are not verified real businesses or live inventory. Confirm final price, product variant, and stock directly with a seller before visiting. Locality selection filters sample store data; the app does not use GPS.

## Features

- Responsive home page, category navigation, product search, category/locality filters, and price sorting.
- Product details with like-for-like comparison (product name, brand, package size, and variant must all match).
- Interactive OpenStreetMap locator with red demo-store markers, locality search, radius filtering, approximate distances, and click-to-view sample store listings.
- Optional browser geolocation, requested only after the customer selects **Use My Current Location**.
- The lowest listed price is highlighted alongside each listing's stock status; prices and stock remain demo data and may be stale.
- Persistent shopping list and seller product catalog using browser `localStorage`.
- Seller listing create, edit, delete, price, stock, discount, category, sample store, and locality selection.
- WhatsApp and phone links generated from the sample store contact details.
- Clearly labeled demo reservation interaction; it does not send a real booking.
- React Router routes and accessible labels, responsive layouts, empty states, and inline form validation.
- `.env.example` documents optional future Supabase configuration. Supabase is not needed for this demo.

## Technology

- React 18 and Vite
- JavaScript, HTML5, and CSS3
- React Router DOM
- React Leaflet, Leaflet, and OpenStreetMap tiles (no paid map API key)
- Lucide React
- Browser localStorage for demo persistence
- Supabase environment placeholders for a future backend

## Requirements

- Node.js 20.19+ or 22.12+ (supported by Vite 6)
- npm

## Run in Windows PowerShell

If you are starting from a new folder, the requested scaffolding commands are:

```powershell
npm create vite@latest smartcart-connect -- --template react
cd smartcart-connect
npm install
npm install react-router-dom lucide-react
npm run dev
```

In this already-scaffolded workspace, open PowerShell in the project folder and run:

```powershell
cd E:\SmartCart-Connect
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To check the production build:

```powershell
npm run build
```

## Try the demo

1. Use **Explore products** to search by product name or brand, filter by category and locality, and sort by price.
2. Open a product to see its seller listing and exact-variant comparison. Comparison never groups different brands, sizes, or variants.
3. Use **Add to shopping list** (heart) and visit **Shopping list** to remove individual items or clear the list. Refresh to confirm the list is saved.
4. Open **Seller dashboard**, add a listing, then edit its price, stock, discount, category, and sample store. Refresh the page to confirm the catalog persists.
5. Try **Reserve** to see a demo-only acknowledgement. Use seller WhatsApp or phone links to initiate contact from your own device.
6. On **Explore products**, scroll to **Nearby Stores Map**. Search a listed Bengaluru demo locality or click **Use My Current Location** to request browser permission. Change the radius to filter red demo-store markers; select a marker to review store details and sample stock.

## Data and reset

Sample products and stores are in `src/data/products.js` and `src/data/stores.js`. App changes are stored under `smartcart-demo-products`, `smartcart-shopping-list`, and `smartcart-locality` in localStorage. To reset the demo, remove those keys in browser developer tools under **Application → Local Storage**.

Store map coordinates are approximate demonstration points, not exact business addresses. Radius distances are straight-line estimates. Locality search uses the built-in demo locality list and does not geocode arbitrary addresses.

## Future Supabase integration

The app intentionally does not instantiate a Supabase client, so no credentials are required. Optional placeholder keys are listed in `.env.example`; add a backend client and server-side authorization only when a Supabase project is configured.
