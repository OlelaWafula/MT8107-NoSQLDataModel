# NoSQL Document Store Lab Guide: MongoDB

## Overview
This lab introduces you to MongoDB, a popular document-oriented NoSQL database. You'll learn how to set up MongoDB using Docker, perform basic CRUD operations, and work with a realistic e-commerce product catalog scenario.

## Learning Objectives
- Understand the fundamentals of document store databases
- Set up MongoDB using Docker containers
- Perform CRUD operations on document collections
- Model real-world data using document structures
- Query and aggregate data effectively

## Prerequisites
- Docker Desktop installed on your machine
- Basic understanding of JSON/BSON data structures
- Familiarity with command line operations

## Estimated Time
30-45 minutes

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Basic Operations](#basic-operations)
3. [Applied Scenario: E-commerce Product Catalog](#applied-scenario)
4. [Advanced Queries](#advanced-queries)
5. [Cleanup](#cleanup)
6. [Group Contributions](#group-contributions)

---

## Setup Instructions

### Step 1: Verify Docker Installation
First, ensure Docker is running on your system:

```bash
docker --version
docker-compose --version
```

### Step 2: Create Project Structure
Create the following directory structure:

```bash
mkdir mongodb-lab
cd mongodb-lab
mkdir data scripts
```

### Step 3: Create Docker Compose Configuration
Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: mongodb-lab
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    ports:
      - "27017:27017"
    volumes:
      - ./data:/data/db
      - ./scripts:/docker-entrypoint-initdb.d
    networks:
      - mongodb-network

  mongo-express:
    image: mongo-express:1.0.0
    container_name: mongo-express
    restart: always
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: password123
      ME_CONFIG_MONGODB_URL: mongodb://admin:password123@mongodb:27017/
    ports:
      - "8081:8081"
    depends_on:
      - mongodb
    networks:
      - mongodb-network

networks:
  mongodb-network:
    driver: bridge
```

### Step 4: Start MongoDB Services
Run the following command to start the MongoDB services:

```bash
docker-compose up -d
```

### Step 5: Verify Installation
Check if the containers are running:

```bash
docker ps
```

You should see both `mongodb-lab` and `mongo-express` containers running.

### Step 6: Access MongoDB Shell
Connect to the MongoDB shell:

```bash
docker exec -it mongodb-lab mongosh -u admin -p password123
```

### Step 7: Access Web Interface
Open your browser and navigate to `http://localhost:8081` to access the MongoDB Express web interface.

---

## Basic Operations

### Step 1: Create and Switch to Database
In the MongoDB shell, create and switch to a new database:

```javascript
use ecommerce_db
```

### Step 2: Create Collections and Insert Documents
Let's create a products collection with sample data:

```javascript
// Insert a single product
db.products.insertOne({
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
})

// Insert multiple products
db.products.insertMany([
  {
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
])
```

### Step 3: Read Operations (Query Documents)

```javascript
// Find all products
db.products.find()

// Find products in stock
db.products.find({ inStock: true })

// Find products by category
db.products.find({ category: "Electronics" })

// Find products with price less than $100
db.products.find({ price: { $lt: 100 } })

// Find products with specific tag
db.products.find({ tags: "wireless" })

// Find one product by name
db.products.findOne({ name: "Wireless Bluetooth Headphones" })

// Project specific fields
db.products.find({}, { name: 1, price: 1, brand: 1, _id: 0 })
```

### Step 4: Update Operations

```javascript
// Update a single document
db.products.updateOne(
  { name: "Wireless Bluetooth Headphones" },
  { $set: { price: 79.99 } }
)

// Update multiple documents
db.products.updateMany(
  { category: "Electronics" },
  { $set: { category: "Audio Equipment" } }
)

// Add a new field to all documents
db.products.updateMany(
  {},
  { $set: { lastUpdated: new Date() } }
)

// Increment price by 10%
db.products.updateMany(
  { category: "Wearables" },
  { $mul: { price: 1.1 } }
)
```

### Step 5: Delete Operations

```javascript
// Delete a single document
db.products.deleteOne({ name: "Organic Cotton T-Shirt" })

// Delete multiple documents
db.products.deleteMany({ inStock: false })

// Delete all documents in a collection
db.products.deleteMany({})
```

---

## Applied Scenario: E-commerce Product Catalog

### Problem Statement
You're building an e-commerce platform that needs to store product information with varying attributes. Traditional relational databases struggle with this because:
- Different product categories have different attributes
- Product specifications can be nested and complex
- The schema needs to be flexible for future product types

### Solution: Document Store Approach
MongoDB's document model is perfect for this scenario because:
- Each product can have its own structure
- Nested objects handle complex specifications
- Arrays store multiple values (tags, sizes, colors)
- Schema flexibility allows easy addition of new product types

### Step 1: Create Enhanced Product Schema
Let's create a more comprehensive product catalog:

```javascript
// Clear existing data
db.products.deleteMany({})

// Insert diverse product types
db.products.insertMany([
  {
    productId: "PROD001",
    name: "Gaming Laptop",
    brand: "GameTech",
    price: 1299.99,
    category: "Computers",
    subcategory: "Laptops",
    inStock: true,
    stockQuantity: 15,
    specifications: {
      processor: "Intel i7-12700H",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      graphics: "RTX 3060",
      screenSize: "15.6 inch",
      resolution: "1920x1080"
    },
    variants: [
      { color: "Black", price: 1299.99, stock: 10 },
      { color: "White", price: 1349.99, stock: 5 }
    ],
    tags: ["gaming", "laptop", "high-performance"],
    ratings: {
      average: 4.5,
      count: 127
    },
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    productId: "PROD002",
    name: "Yoga Mat",
    brand: "FitLife",
    price: 29.99,
    category: "Sports",
    subcategory: "Fitness",
    inStock: true,
    stockQuantity: 50,
    specifications: {
      material: "TPE",
      thickness: "6mm",
      dimensions: "183cm x 61cm",
      weight: "1.2kg",
      grip: "Non-slip"
    },
    variants: [
      { color: "Purple", price: 29.99, stock: 20 },
      { color: "Blue", price: 29.99, stock: 15 },
      { color: "Green", price: 29.99, stock: 15 }
    ],
    tags: ["yoga", "fitness", "exercise"],
    ratings: {
      average: 4.2,
      count: 89
    },
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    productId: "PROD003",
    name: "Coffee Maker",
    brand: "BrewMaster",
    price: 89.99,
    category: "Home & Kitchen",
    subcategory: "Appliances",
    inStock: false,
    stockQuantity: 0,
    specifications: {
      capacity: "12 cups",
      power: "900W",
      features: ["Programmable", "Auto-shutoff", "Pause and serve"],
      dimensions: "30cm x 25cm x 35cm"
    },
    variants: [
      { color: "Stainless Steel", price: 89.99, stock: 0 },
      { color: "Black", price: 79.99, stock: 0 }
    ],
    tags: ["coffee", "kitchen", "appliance"],
    ratings: {
      average: 4.7,
      count: 203
    },
    createdAt: new Date(),
    lastUpdated: new Date()
  }
])
```

### Step 2: Complex Queries for E-commerce

```javascript
// Find products with high ratings (4.5+)
db.products.find({ "ratings.average": { $gte: 4.5 } })

// Find products in specific price range
db.products.find({ 
  price: { $gte: 50, $lte: 200 } 
})

// Find products with specific specifications
db.products.find({ 
  "specifications.ram": "16GB DDR4" 
})

// Find products with multiple tags
db.products.find({ 
  tags: { $all: ["gaming", "high-performance"] } 
})

// Find products with stock available
db.products.find({ 
  stockQuantity: { $gt: 0 } 
})

// Find products by brand and category
db.products.find({ 
  brand: "GameTech", 
  category: "Computers" 
})
```

### Step 3: Aggregation Pipeline
Use MongoDB's aggregation framework for complex analytics:

```javascript
// Average price by category
db.products.aggregate([
  { $group: { 
    _id: "$category", 
    avgPrice: { $avg: "$price" },
    count: { $sum: 1 }
  }},
  { $sort: { avgPrice: -1 } }
])

// Products with highest ratings
db.products.aggregate([
  { $match: { "ratings.count": { $gte: 50 } } },
  { $sort: { "ratings.average": -1 } },
  { $limit: 5 },
  { $project: { 
    name: 1, 
    brand: 1, 
    "ratings.average": 1, 
    "ratings.count": 1 
  }}
])

// Stock analysis by category
db.products.aggregate([
  { $group: { 
    _id: "$category", 
    totalStock: { $sum: "$stockQuantity" },
    avgStock: { $avg: "$stockQuantity" },
    productCount: { $sum: 1 }
  }},
  { $sort: { totalStock: -1 } }
])
```

### Step 4: Text Search
Enable text search on product names and tags:

```javascript
// Create text index
db.products.createIndex({ 
  name: "text", 
  tags: "text" 
})

// Search for products containing "gaming"
db.products.find({ 
  $text: { $search: "gaming" } 
})

// Search with relevance score
db.products.find(
  { $text: { $search: "fitness exercise" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

---

## Advanced Queries

### Step 1: Array Operations

```javascript
// Find products with specific variant colors
db.products.find({ 
  "variants.color": "Black" 
})

// Find products with multiple variants
db.products.find({ 
  "variants.1": { $exists: true } 
})

// Update specific variant price
db.products.updateOne(
  { productId: "PROD001", "variants.color": "White" },
  { $set: { "variants.$.price": 1399.99 } }
)
```

### Step 2: Nested Object Queries

```javascript
// Find products with specific specification values
db.products.find({ 
  "specifications.screenSize": "15.6 inch" 
})

// Find products with nested object conditions
db.products.find({ 
  "specifications.capacity": { $exists: true } 
})
```

### Step 3: Date Range Queries

```javascript
// Find products created in the last 7 days
db.products.find({ 
  createdAt: { 
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
  } 
})

// Find products updated today
db.products.find({ 
  lastUpdated: { 
    $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
  } 
})
```

---

## Cleanup

### Step 1: Stop Docker Containers
```bash
docker-compose down
```

### Step 2: Remove Volumes (Optional)
To completely remove all data:
```bash
docker-compose down -v
rm -rf data/
```

### Step 3: Verify Cleanup
```bash
docker ps
```

---

## Group Contributions

### Team Member 1: Martin Ondu Oraro 224345
- **Responsibilities**: Project setup and Docker configuration
- **Contributions**: 
  - Created Docker Compose configuration
  - Set up MongoDB and Mongo Express containers
  - Wrote setup instructions and verification steps

### Team Member 2: Olela Wafula James 112757
- **Responsibilities**: Basic CRUD operations and documentation
- **Contributions**:
  - Designed sample data structure
  - Implemented CRUD operation examples
  - Created comprehensive query examples

### Team Member 3: Chepsol Sammy 224161
- **Responsibilities**: Applied scenario and advanced features
- **Contributions**:
  - Developed e-commerce product catalog scenario
  - Implemented aggregation pipelines
  - Created text search functionality

### Team Member 4: ALL(Martin Ondu Oraro 224345,Olela Wafula James 112757,Chepsol Sammy 224161)
- **Responsibilities**: Testing and quality assurance
- **Contributions**:
  - Verified all code examples work correctly
  - Tested Docker setup on different environments
  - Reviewed documentation for clarity and completeness

---

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Aggregation Framework](https://docs.mongodb.com/manual/aggregation/)
- [MongoDB Text Search](https://docs.mongodb.com/manual/text-search/)
- [Docker MongoDB Image](https://hub.docker.com/_/mongo)

## Troubleshooting

### Common Issues

1. **Port 27017 already in use**
   - Solution: Stop any existing MongoDB services or change the port in docker-compose.yml

2. **Permission denied when accessing data directory**
   - Solution: Ensure Docker has proper permissions to access the ./data directory

3. **MongoDB connection refused**
   - Solution: Wait a few seconds for the container to fully start, then retry

4. **Authentication failed**
   - Solution: Verify the username and password match those in docker-compose.yml

---

*This lab guide provides a comprehensive introduction to MongoDB document store database. The examples demonstrate real-world usage patterns and best practices for working with document-oriented data.* 