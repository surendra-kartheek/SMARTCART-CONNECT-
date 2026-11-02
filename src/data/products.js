const image = {
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=85',
  pulses: 'https://images.unsplash.com/photo-1515543904379-3d7578f9b9c9?auto=format&fit=crop&w=800&q=85',
  sugar: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=800&q=85',
  produce: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=85',
  shirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
  home: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85',
  jewellery: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=85',
};

const updated = '2026-10-30T10:30:00+05:30';
const listing = (id, name, category, brand, quantity, variant, storeId, price, stock, discount, photo, description) => ({
  id, name, category, brand, quantity, variant, storeId, price, stock, discount, image: photo, description, updatedAt: updated,
});

export const initialProducts = [
  listing('p-rice-a', 'Sona Masoori Rice', 'Groceries', 'Harvest Gold', '25 kg', 'Premium, raw', 's1', 1200, 18, 8, image.rice, 'A pantry staple with a light texture, shown as a sample listing.'),
  listing('p-rice-b', 'Sona Masoori Rice', 'Groceries', 'Harvest Gold', '25 kg', 'Premium, raw', 's2', 1150, 7, 12, image.rice, 'A pantry staple with a light texture, shown as a sample listing.'),
  listing('p-rice-c', 'Sona Masoori Rice', 'Groceries', 'Harvest Gold', '25 kg', 'Premium, raw', 's3', 1100, 0, 0, image.rice, 'A pantry staple with a light texture, shown as a sample listing.'),
  listing('p-oil-a', 'Sunflower Oil', 'Groceries', 'PureDrop', '1 L', 'Refined', 's1', 142, 24, 5, image.oil, 'Light, everyday cooking oil in a one-litre bottle.'),
  listing('p-oil-b', 'Sunflower Oil', 'Groceries', 'PureDrop', '1 L', 'Refined', 's2', 149, 12, 0, image.oil, 'Light, everyday cooking oil in a one-litre bottle.'),
  listing('p-dal-a', 'Toor Dal', 'Groceries', 'Farmstead', '1 kg', 'Unpolished', 's2', 168, 15, 7, image.pulses, 'Unpolished toor dal for everyday meals.'),
  listing('p-dal-b', 'Toor Dal', 'Groceries', 'Farmstead', '1 kg', 'Unpolished', 's3', 159, 9, 0, image.pulses, 'Unpolished toor dal for everyday meals.'),
  listing('p-sugar', 'Organic Cane Sugar', 'Groceries', 'Earth & Root', '1 kg', 'Organic', 's1', 82, 11, 0, image.sugar, 'Small-batch organic cane sugar sample listing.'),
  listing('p-tomato', 'Tomatoes', 'Fruits & vegetables', 'Local produce', '1 kg', 'Fresh, grade A', 's3', 38, 20, 0, image.produce, 'Fresh produce sample; final quality should be checked with the seller.'),
  listing('p-mango', 'Alphonso Mangoes', 'Fruits & vegetables', 'Orchard Select', '1 kg', 'Ripe, grade A', 's1', 260, 5, 10, image.produce, 'Seasonal fruit sample listing.'),
  listing('p-spinach', 'Baby Spinach', 'Fruits & vegetables', 'Local produce', '250 g', 'Fresh, washed', 's3', 35, 14, 0, image.produce, 'Washed baby spinach sample listing.'),
  listing('p-shirt', 'Classic Cotton T-shirt', 'Fashion', 'Threadline', '1 piece', 'Navy, size M', 's4', 699, 8, 15, image.shirt, 'Soft cotton crew-neck tee. Check size availability before visiting.'),
  listing('p-shirt2', 'Classic Cotton T-shirt', 'Fashion', 'Threadline', '1 piece', 'Navy, size L', 's4', 699, 4, 10, image.shirt, 'Soft cotton crew-neck tee. Size L variant.'),
  listing('p-headphones', 'Wireless Headphones', 'Electronics', 'SoundForm', '1 piece', 'Bluetooth, black', 's5', 2499, 6, 12, image.headphones, 'Over-ear wireless headphones with cushioned ear cups.'),
  listing('p-cable', 'USB-C Fast Charge Cable', 'Electronics', 'VoltLoop', '1 piece', '1 m, 60 W', 's5', 299, 19, 0, image.headphones, 'Braided USB-C charging cable sample listing.'),
  listing('p-detergent', 'Laundry Detergent', 'Household', 'BrightDay', '2 kg', 'Front-load, fresh scent', 's2', 385, 10, 8, image.home, 'Concentrated detergent powder for front-load machines.'),
  listing('p-lamp', 'Ceramic Table Lamp', 'Household', 'Nest & Nook', '1 piece', 'Warm white, cream', 's6', 1299, 3, 0, image.home, 'A compact ceramic table lamp, demo inventory only.'),
  listing('p-earrings', 'Minimal Hoop Earrings', 'Jewellery', 'Luna Studio', '1 pair', 'Gold-tone, 20 mm', 's6', 549, 7, 5, image.jewellery, 'Lightweight gold-tone hoops. Material details should be confirmed with the seller.'),
];

export const productMatchKey = (product) =>
  [product.name, product.brand, product.quantity, product.variant]
    .map((part) => String(part ?? '').trim().toLocaleLowerCase())
    .join('|');
