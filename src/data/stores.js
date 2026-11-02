export const stores = [
  { id: 's1', name: 'Green Basket Market', locality: 'Koramangala', address: 'Demo location, 5th Block, Koramangala, Bengaluru', latitude: 12.9340, longitude: 77.6260, phone: '919876543210', rating: '4.8', note: 'Groceries · Daily essentials' },
  { id: 's2', name: 'Daily Needs Corner', locality: 'Indiranagar', address: 'Demo location, 100 Feet Road area, Indiranagar, Bengaluru', latitude: 12.9784, longitude: 77.6408, phone: '919876543211', rating: '4.7', note: 'Groceries · Household' },
  { id: 's3', name: 'Fresh & Fair Store', locality: 'HSR Layout', address: 'Demo location, Sector 2, HSR Layout, Bengaluru', latitude: 12.9116, longitude: 77.6389, phone: '919876543212', rating: '4.9', note: 'Fresh produce · Pantry' },
  { id: 's4', name: 'City Style Collective', locality: 'Jayanagar', address: 'Demo location, 4th Block, Jayanagar, Bengaluru', latitude: 12.9250, longitude: 77.5838, phone: '919876543213', rating: '4.6', note: 'Fashion · Accessories' },
  { id: 's5', name: 'ElectroHub Local', locality: 'Whitefield', address: 'Demo location, Whitefield Main Road area, Bengaluru', latitude: 12.9698, longitude: 77.7500, phone: '919876543214', rating: '4.8', note: 'Electronics · Accessories' },
  { id: 's6', name: 'Home & More Demo', locality: 'Malleshwaram', address: 'Demo location, 8th Cross area, Malleshwaram, Bengaluru', latitude: 13.0031, longitude: 77.5640, phone: '919876543215', rating: '4.5', note: 'Home · Jewellery' },
];

export const localities = [...new Set(stores.map((store) => store.locality))];

export const localityLocations = {
  Koramangala: { latitude: 12.9352, longitude: 77.6245 },
  Indiranagar: { latitude: 12.9784, longitude: 77.6408 },
  'HSR Layout': { latitude: 12.9116, longitude: 77.6389 },
  Jayanagar: { latitude: 12.9250, longitude: 77.5838 },
  Whitefield: { latitude: 12.9698, longitude: 77.7500 },
  Malleshwaram: { latitude: 13.0031, longitude: 77.5640 },
};
