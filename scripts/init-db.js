// MongoDB initialization script
// This script runs automatically when the MongoDB container starts

// Switch to the ecommerce database
db = db.getSiblingDB('ecommerce_db');

// Create collections and insert sample data
print('Initializing ecommerce database...');

// Insert sample products
db.products.insertMany([
  {
    productId: "PROD001",
    name: "Wireless Bluetooth Headphones",
    brand: "TechAudio",
    price: 89.99,
    category: "Electronics",
    inStock: true,
    specifications: {
      batteryLife: "20 hours",
      connectivity: "Bluetooth 5.0",
      weight: "250g"
    },
    tags: ["wireless", "bluetooth", "audio"],
    createdAt: new Date()
  },
  {
    productId: "PROD002",
    name: "Smart Fitness Watch",
    brand: "FitTech",
    price: 199.99,
    category: "Wearables",
    inStock: true,
    specifications: {
      batteryLife: "7 days",
      waterResistant: "5ATM",
      screenSize: "1.4 inch"
    },
    tags: ["fitness", "smartwatch", "health"],
    createdAt: new Date()
  },
  {
    productId: "PROD003",
    name: "Organic Cotton T-Shirt",
    brand: "EcoWear",
    price: 24.99,
    category: "Clothing",
    inStock: false,
    specifications: {
      material: "100% Organic Cotton",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Navy"]
    },
    tags: ["organic", "cotton", "sustainable"],
    createdAt: new Date()
  }
]);

// Create indexes for better performance
db.products.createIndex({ "productId": 1 }, { unique: true });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "brand": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "tags": 1 });

print('Database initialization completed successfully!');
print('Sample data inserted: ' + db.products.countDocuments() + ' products'); 