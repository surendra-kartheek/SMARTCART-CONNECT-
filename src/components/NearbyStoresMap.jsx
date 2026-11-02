import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { ArrowUpRight, LocateFixed, MapPin, MessageCircle, Navigation, Phone, Search, Store as StoreIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { localities, localityLocations, stores } from '../data/stores.js';
import { distanceInKilometers } from '../utils/geo.js';
import { getWhatsAppLink } from '../utils/whatsapp.js';

const INITIAL_LOCALITY = 'Koramangala';
const INITIAL_CENTER = [localityLocations[INITIAL_LOCALITY].latitude, localityLocations[INITIAL_LOCALITY].longitude];
const RADIUS_OPTIONS = [1, 2, 5, 10];
function MapViewport({ center, radius, mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    map.setView(center, map.getZoom(), { animate: true });
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    return () => window.clearTimeout(timer);
  }, [center, map, mapRef]);

  useEffect(() => {
    const mapElement = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(mapElement);
    return () => observer.disconnect();
  }, [map]);

  return <Circle center={center} radius={radius * 1000} pathOptions={{ color: '#4f8bc9', fillColor: '#73a6d8', fillOpacity: 0.1, weight: 2 }} />;
}

function StoreProducts({ store, products, limit }) {
  const listings = products.filter((product) => product.storeId === store.id);
  const visibleListings = limit ? listings.slice(0, limit) : listings;

  if (!visibleListings.length) return <p className="map-no-products">No sample product listings for this store yet.</p>;

  return (
    <ul className="map-product-list">
      {visibleListings.map((product) => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`} className="map-product-name">{product.name}</Link>
          <span className="map-product-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
          <span className={`map-stock ${Number(product.stock) > 0 ? 'map-stock-available' : 'map-stock-unavailable'}`}>
            {Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StorePopup({ store, products, distance, onViewDetails }) {
  const whatsApp = getWhatsAppLink(store.phone, `Hi ${store.name}, could you confirm today's prices and stock for your listings on SmartCart Connect?`);

  return (
    <div className="map-popup-content">
      <strong className="map-popup-title">{store.name}</strong>
      <span className="map-popup-address"><MapPin size={12} /> {store.address}</span>
      <span className="map-popup-distance"><Navigation size={12} /> {distance.toFixed(1)} km from selected location</span>
      <span className="map-popup-label">Products and stock status</span>
      <StoreProducts store={store} products={products} limit={3} />
      <div className="map-popup-actions">
        <a href={whatsApp} target="_blank" rel="noreferrer" className="map-popup-contact"><MessageCircle size={13} /> Contact store</a>
        <button type="button" className="map-popup-details" onClick={() => onViewDetails(store.id)}>View Store Details</button>
      </div>
    </div>
  );
}

export default function NearbyStoresMap({ products, locality, onLocalityChange }) {
  const mapRef = useRef(null);
  const detailsRef = useRef(null);
  const [radius, setRadius] = useState(5);
  const [search, setSearch] = useState(localityLocations[locality] ? locality : INITIAL_LOCALITY);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [locationLabel, setLocationLabel] = useState(INITIAL_LOCALITY);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const nextLocality = localityLocations[locality] ? locality : INITIAL_LOCALITY;
    setSearch(nextLocality);
    setCenter([localityLocations[nextLocality].latitude, localityLocations[nextLocality].longitude]);
    setLocationLabel(nextLocality);
    setSelectedStoreId(null);
  }, [locality]);

  const { matchingStores, distances } = useMemo(() => {
    const distanceByStoreId = new Map();
    const matches = [];
    for (const store of stores) {
      const location = localityLocations[store.locality];
      const latitude = Number.isFinite(store.latitude) ? store.latitude : location?.latitude;
      const longitude = Number.isFinite(store.longitude) ? store.longitude : location?.longitude;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
      const distance = distanceInKilometers(
        { latitude: center[0], longitude: center[1] },
        { latitude, longitude },
      );
      distanceByStoreId.set(store.id, distance);
      if (distance <= radius) matches.push({ ...store, latitude, longitude });
    }
    return { matchingStores: matches, distances: distanceByStoreId };
  }, [center, radius]);

  const selectedStore = stores.find((store) => store.id === selectedStoreId);

  const submitSearch = (event) => {
    event.preventDefault();
    const normalized = search.trim().toLocaleLowerCase();
    const selectedLocality = localities.find((item) =>
      item.toLocaleLowerCase() === normalized || `${item.toLocaleLowerCase()}, bengaluru` === normalized,
    );
    if (!selectedLocality) {
      setLocationError('Choose a listed demo locality from the suggestions. Map search does not use a geocoding service.');
      return;
    }
    setLocationError('');
    setSelectedStoreId(null);
    setCenter([localityLocations[selectedLocality].latitude, localityLocations[selectedLocality].longitude]);
    setLocationLabel(selectedLocality);
    onLocalityChange(selectedLocality);
  };

  const useCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('This browser does not support location access. Choose a demo locality instead.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter = [position.coords.latitude, position.coords.longitude];
        setCenter(nextCenter);
        setLocationLabel('My current location');
        setSearch('');
        setSelectedStoreId(null);
        setIsLocating(false);
        mapRef.current?.setView(nextCenter, 14, { animate: true });
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission was denied. Allow location access in your browser or choose a demo locality.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Your current location is unavailable. Choose a demo locality instead.');
        } else {
          setLocationError('Location request timed out. Try again or choose a demo locality.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const viewStoreDetails = (storeId) => {
    setSelectedStoreId(storeId);
    window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  };

  const returnToLocation = () => {
    if (mapRef.current) mapRef.current.setView(center, Math.min(mapRef.current.getZoom(), 13), { animate: true });
  };

  return (
    <section className="nearby-map-section" aria-labelledby="nearby-map-title">
      <div className="nearby-map-heading">
        <div>
          <span className="eyebrow">Explore stores around you</span>
          <h2 id="nearby-map-title">Nearby Stores Map</h2>
          <p>Find demo store locations and check their sample listings before you visit.</p>
        </div>
        <span className="demo-pill map-demo-pill"><MapPin size={13} /> DEMO LOCATIONS</span>
      </div>

      <div className="map-controls">
        <form className="map-location-search" onSubmit={submitSearch}>
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="nearby-location-search">Search a demo locality in Bengaluru</label>
          <input
            id="nearby-location-search"
            list="nearby-locality-options"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setLocationError(''); }}
            placeholder="Search a locality in Bengaluru"
            autoComplete="off"
          />
          <datalist id="nearby-locality-options">
            {localities.flatMap((item) => [
              <option key={item} value={item} />,
              <option key={`${item}-bengaluru`} value={`${item}, Bengaluru`} />,
            ])}
          </datalist>
          <button type="submit" className="button button-dark map-search-button">Find stores</button>
        </form>
        <button type="button" className="button button-outline current-location-button" onClick={useCurrentLocation} disabled={isLocating}>
          <LocateFixed size={16} /> {isLocating ? 'Finding location…' : 'Use My Current Location'}
        </button>
        <label className="radius-control" htmlFor="store-radius">
          <span>Search radius</span>
          <select id="store-radius" value={radius} onChange={(event) => { setRadius(Number(event.target.value)); setSelectedStoreId(null); }}>
            {RADIUS_OPTIONS.map((option) => <option key={option} value={option}>{option} KM</option>)}
          </select>
        </label>
      </div>
      {locationError && <p className="map-location-error" role="alert">{locationError}</p>}

      <div className="map-summary">
        <span><MapPin size={15} /> Around <strong>{locationLabel}</strong></span>
        <span><span className="map-red-legend" /> <strong>{matchingStores.length}</strong> demo {matchingStores.length === 1 ? 'store' : 'stores'} within <strong>{radius} km</strong></span>
      </div>

      <div className="nearby-map-layout">
        <div className="leaflet-map-frame" aria-label="Interactive map of demo nearby stores">
          <MapContainer center={center} zoom={12} zoomControl={false} scrollWheelZoom className="leaflet-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapViewport center={center} radius={radius} mapRef={mapRef} />
            <CircleMarker center={center} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#3186d5', fillOpacity: 1 }}>
              <Popup><strong>{locationLabel}</strong><br />Selected search location</Popup>
            </CircleMarker>
            {matchingStores.map((store) => (
              <CircleMarker
                key={store.id}
                center={[store.latitude, store.longitude]}
                radius={selectedStoreId === store.id ? 10 : 8}
                pathOptions={{ color: '#fff', weight: 2, fillColor: '#df4343', fillOpacity: 1 }}
                eventHandlers={{ click: () => setSelectedStoreId(store.id) }}
              >
                <Popup>
                  <StorePopup
                    store={store}
                    products={products}
                    distance={distances.get(store.id) ?? 0}
                    onViewDetails={viewStoreDetails}
                  />
                </Popup>
              </CircleMarker>
            ))}
            <MapButtons onReturn={returnToLocation} />
          </MapContainer>
        </div>
        <aside className="map-store-panel" ref={detailsRef}>
          {selectedStore ? (
            <StoreDetails store={selectedStore} products={products} distance={distances.get(selectedStore.id)} />
          ) : (
            <div className="map-panel-empty">
              <span className="map-panel-icon"><StoreIcon size={20} /></span>
              <span className="eyebrow">Local store finder</span>
              <h3>Select a red marker</h3>
              <p>Tap a demo store on the map to see its address, distance, sample products, prices and stock.</p>
              <span className="map-panel-tip"><span className="map-blue-legend" /> Blue marker shows your selected location.</span>
            </div>
          )}
        </aside>
      </div>
      <p className="map-demo-note"><MapPin size={14} /> All red pins and addresses are illustrative demo store locations around Bengaluru, not verified businesses or partnerships. Distances are approximate straight-line estimates.</p>
      {!matchingStores.length && (
        <div className="map-no-results" role="status">
          <MapPin size={19} /><strong>No demo stores within {radius} km.</strong>
          <span>Try a wider radius or choose another Bengaluru locality.</span>
        </div>
      )}
    </section>
  );
}

function MapButtons({ onReturn }) {
  const map = useMap();
  return (
    <div className="map-extra-controls">
      <button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => map.zoomIn()}><span>+</span></button>
      <button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => map.zoomOut()}><span>−</span></button>
      <button type="button" aria-label="Return to selected location" title="Return to selected location" onClick={onReturn}><Navigation size={15} /></button>
    </div>
  );
}

function StoreDetails({ store, products, distance }) {
  const whatsApp = getWhatsAppLink(store.phone, `Hi ${store.name}, could you confirm today's prices and stock for your listings on SmartCart Connect?`);
  return (
    <div className="map-store-details">
      <div className="map-store-detail-title">
        <span className="store-avatar">{store.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span>
        <span><span className="eyebrow">Selected demo store</span><h3>{store.name}</h3></span>
      </div>
      <p className="map-detail-address"><MapPin size={15} /> {store.address}</p>
      <p className="map-detail-distance"><Navigation size={15} /> About {Number(distance ?? 0).toFixed(1)} km from your selected location</p>
      <div className="map-detail-products-heading"><strong>Sample products</strong><span>{products.filter((product) => product.storeId === store.id).length} listings</span></div>
      <StoreProducts store={store} products={products} />
      <div className="map-detail-actions">
        <a href={whatsApp} target="_blank" rel="noreferrer" className="button button-whatsapp"><MessageCircle size={15} /> Contact store</a>
        <a href={`tel:+${store.phone}`} className="button button-outline"><Phone size={15} /> Call store</a>
      </div>
      <Link to={`/explore?locality=${encodeURIComponent(store.locality)}`} className="map-view-listings">Explore {store.locality} listings <ArrowUpRight size={14} /></Link>
      <p className="map-detail-disclaimer">Demo prices and availability only. Confirm directly with the seller.</p>
    </div>
  );
}
