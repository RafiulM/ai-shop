import { db } from '../db';
import { products } from '../db/schema';

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
    price: '199.99',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    stock: 15,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and smartphone integration. Water-resistant with 7-day battery life.',
    price: '299.99',
    imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    stock: 8,
  },
  {
    name: 'Eco-Friendly Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly design.',
    price: '24.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    stock: 50,
  },
  {
    name: 'Portable Phone Charger',
    description: 'High-capacity 20,000mAh power bank with fast charging, multiple USB ports, and LED display. Compatible with all devices.',
    price: '49.99',
    imageUrl: 'https://images.unsplash.com/photo-1596398258072-eb2a18bbbd5b?w=400&h=400&fit=crop',
    stock: 25,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable, sustainable organic cotton t-shirt in various colors. Soft, breathable, and ethically produced.',
    price: '29.99',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    stock: 30,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Modern adjustable LED desk lamp with touch control, USB charging port, and multiple brightness levels. Eye-friendly lighting.',
    price: '79.99',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    stock: 12,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning, breathable mesh upper, and durable rubber sole. Perfect for daily runs and workouts.',
    price: '129.99',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    stock: 20,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking, programmable buttons, and long battery life. Comfortable for extended use.',
    price: '39.99',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    stock: 35,
  },
  {
    name: 'Yoga Mat',
    description: 'Premium non-slip yoga mat with excellent grip and cushioning. Made from eco-friendly materials, perfect for yoga and exercise.',
    price: '34.99',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    stock: 18,
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe, auto-shutoff, and brew strength control. Makes perfect coffee every time.',
    price: '89.99',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    stock: 10,
  },
];

async function seedProducts() {
  console.log('Seeding products...');

  try {
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }

    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

seedProducts();