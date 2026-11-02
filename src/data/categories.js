export const categories = [
  { name: 'All categories', icon: 'Grid2X2' },
  { name: 'Groceries', icon: 'ShoppingBasket' },
  { name: 'Fruits & vegetables', icon: 'Salad' },
  { name: 'Fashion', icon: 'Shirt' },
  { name: 'Electronics', icon: 'Smartphone' },
  { name: 'Household', icon: 'House' },
  { name: 'Jewellery', icon: 'Gem' },
];

export const productCategories = categories.slice(1).map(({ name }) => name);
