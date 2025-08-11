# NoSQL Document Store Lab Guide: MongoDB

**Course:** MT8107 - NoSQL Data Models  
**Lab Type:** Document Store Database  
**Estimated Time:** 30-45 minutes  
**Group Size:** 3-4 students  

---

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Basic Operations](#basic-operations)
5. [Applied Scenario: E-commerce Product Catalog](#applied-scenario)
6. [Advanced Queries](#advanced-queries)
7. [Cleanup](#cleanup)
8. [Group Contributions](#group-contributions)

---

## Introduction

### What is a Document Store?
A document store is a type of NoSQL database that stores data in document format, typically JSON or BSON. Unlike relational databases that use tables with predefined schemas, document stores allow flexible, schema-less data structures.

### Why MongoDB?
MongoDB is one of the most popular document store databases, offering:
- **Flexible Schema**: Documents can have different structures
- **Rich Query Language**: Support for complex queries and aggregations
- **Horizontal Scalability**: Easy to scale across multiple servers
- **JSON-like Documents**: Natural data representation

### Learning Objectives
By the end of this lab, you will be able to:
- Set up MongoDB using Docker containers
- Perform CRUD operations on document collections
- Model real-world data using document structures
- Query and aggregate data effectively
- Understand when to use document stores vs. relational databases

---

## Prerequisites

Before starting this lab, ensure you have:

- **Docker Desktop** installed and running on your machine
  - Download from: https://www.docker.com/products/docker-desktop
- **Basic understanding** of JSON data structures
- **Familiarity** with command line operations
- **Web browser** for accessing the MongoDB Express interface

### System Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **Internet Connection**: Required for downloading Docker images

---

## Setup Instructions

### Step 1: Verify Docker Installation

First, ensure Docker is running on your system:

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version
```

**Expected Output:**
```
Docker version 20.10.x, build xxxxxxx
docker-compose version 1.29.x, build xxxxxxx
```

### Step 2: Create Project Structure

Create the following directory structure:

```bash
# Create project directory
mkdir mongodb-lab
cd mongodb-lab

# Create subdirectories
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

**Expected Output:**
```
Creating network "mongodb-lab_mongodb-network" ... done
Creating mongodb-lab ... done
Creating mongo-express ... done
```

### Step 5: Verify Installation

Check if the containers are running:

```bash
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                      NAMES
xxxxxxxxxx     mongo:7.0          "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:27017->27017/tcp   mongodb-lab
xxxxxxxxxx     mongo-express:1.0  "tini -- /docker-ent…"   2 minutes ago   Up 2 minutes   0.0.0.0:8081->8081/tcp      mongo-express
```

### Step 6: Access MongoDB Shell

Connect to the MongoDB shell:

```bash
docker exec -it mongodb-lab mongosh -u admin -p password123
```

**Expected Output:**
```
Current Mongosh Log ID: xxxxxxxxxx
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2
Using MongoDB:          7.0.5
Using Mongosh:          2.0.2

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test>
```

### Step 7: Access Web Interface

Open your browser and navigate to `http://localhost:8081` to access the MongoDB Express web interface.

**Login Credentials:**
- **Username:** admin
- **Password:** password123

---

## Basic Operations

### Step 1: Create and Switch to Database

In the MongoDB shell, create and switch to a new database:

```javascript
use ecommerce_db
```

**Expected Output:**
```
switched to db ecommerce_db
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
```

**Expected Output:**
```
{
  acknowledged: true,
  insertedId: ObjectId("xxxxxxxxxxxxxxxxxxxxxxxx")
}
```

```javascript
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

**Expected Output:**
```
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId("xxxxxxxxxxxxxxxxxxxxxxxx"),
    '1': ObjectId("xxxxxxxxxxxxxxxxxxxxxxxx")
  }
}
```

### Step 3: Read Operations (Query Documents)

```javascript
// Find all products
db.products.find()
```

```javascript
// Find products in stock
db.products.find({ inStock: true })
```

```javascript
// Find products by category
db.products.find({ category: "Electronics" })
```

```javascript
// Find products with price less than $100
db.products.find({ price: { $lt: 100 } })
```

```javascript
// Find products with specific tag
db.products.find({ tags: "wireless" })
```

```javascript
// Find one product by name
db.products.findOne({ name: "Wireless Bluetooth Headphones" })
```

```javascript
// Project specific fields (show only name, price, brand)
db.products.find({}, { name: 1, price: 1, brand: 1, _id: 0 })
```

### Step 4: Update Operations

```javascript
// Update a single document
db.products.updateOne(
  { name: "Wireless Bluetooth Headphones" },
  { $set: { price: 79.99 } }
)
```

```javascript
// Update multiple documents
db.products.updateMany(
  { category: "Electronics" },
  { $set: { category: "Audio Equipment" } }
)
```

```javascript
// Add a new field to all documents
db.products.updateMany(
  {},
  { $set: { lastUpdated: new Date() } }
)
```

```javascript
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
```

```javascript
// Delete multiple documents
db.products.deleteMany({ inStock: false })
```

```javascript
// Delete all documents in a collection
db.products.deleteMany({})
```

---

## Applied Scenario: E-commerce Product Catalog

### Problem Statement

You're building an e-commerce platform that needs to store product information with varying attributes. Traditional relational databases struggle with this because:

- **Different product categories** have different attributes (electronics vs. clothing)
- **Product specifications** can be nested and complex
- **The schema needs to be flexible** for future product types
- **Product variants** (colors, sizes) need to be stored efficiently

### Why Document Store is Perfect for This Scenario

MongoDB's document model is ideal for e-commerce because:

- **Flexible Schema**: Each product can have its own structure
- **Nested Objects**: Handle complex specifications naturally
- **Arrays**: Store multiple values (tags, sizes, colors) efficiently
- **Schema Evolution**: Easy to add new product types without migration

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
```

```javascript
// Find products in specific price range
db.products.find({ 
  price: { $gte: 50, $lte: 200 } 
})
```

```javascript
// Find products with specific specifications
db.products.find({ 
  "specifications.ram": "16GB DDR4" 
})
```

```javascript
// Find products with multiple tags
db.products.find({ 
  tags: { $all: ["gaming", "high-performance"] } 
})
```

```javascript
// Find products with stock available
db.products.find({ 
  stockQuantity: { $gt: 0 } 
})
```

```javascript
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
```

**Expected Output:**
```
[
  { _id: 'Computers', avgPrice: 1299.99, count: 1 },
  { _id: 'Home & Kitchen', avgPrice: 89.99, count: 1 },
  { _id: 'Sports', avgPrice: 29.99, count: 1 }
]
```

```javascript
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
```

```javascript
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
```

```javascript
// Search for products containing "gaming"
db.products.find({ 
  $text: { $search: "gaming" } 
})
```

```javascript
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
```

```javascript
// Find products with multiple variants
db.products.find({ 
  "variants.1": { $exists: true } 
})
```

```javascript
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
```

```javascript
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
```

```javascript
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

**Expected Output:**
```
Stopping mongo-express ... done
Stopping mongodb-lab ... done
Removing mongo-express ... done
Removing mongodb-lab ... done
Removing network mongodb-lab_mongodb-network ... done
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

**Expected Output:** No containers should be running.

---

## Group Contributions

### Team Member 1: [Your Name]
- **Responsibilities**: Project setup and Docker configuration
- **Contributions**: 
  - Created Docker Compose configuration for MongoDB and Mongo Express
  - Set up automated database initialization scripts
  - Wrote comprehensive setup instructions and verification steps
  - Created quick start scripts for both Windows and Unix systems

### Team Member 2: [Your Name]
- **Responsibilities**: Basic CRUD operations and documentation
- **Contributions**:
  - Designed comprehensive sample data structure for e-commerce products
  - Implemented all CRUD operation examples with expected outputs
  - Created step-by-step query examples for beginners
  - Wrote troubleshooting section for common issues

### Team Member 3: [Your Name]
- **Responsibilities**: Applied scenario and advanced features
- **Contributions**:
  - Developed realistic e-commerce product catalog scenario
  - Implemented complex aggregation pipelines for business analytics
  - Created text search functionality and indexing examples
  - Designed advanced query patterns for real-world applications

### Team Member 4: [Your Name]
- **Responsibilities**: Testing and quality assurance
- **Contributions**:
  - Verified all code examples work correctly across different environments
  - Tested Docker setup on Windows, macOS, and Linux
  - Reviewed documentation for clarity and completeness
  - Created sample query practice scripts for hands-on learning

---

## Additional Resources

### Documentation
- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB Aggregation Framework](https://docs.mongodb.com/manual/aggregation/)
- [MongoDB Text Search](https://docs.mongodb.com/manual/text-search/)
- [Docker MongoDB Image](https://hub.docker.com/_/mongo)

### Learning Resources
- [MongoDB University](https://university.mongodb.com/) - Free online courses
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database service
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Port 27017 Already in Use
**Problem**: `Error: Port 27017 is already in use`

**Solution**: 
```bash
# Stop any existing MongoDB services
sudo systemctl stop mongod  # Linux
brew services stop mongodb/brew/mongodb-community  # macOS
# Or change the port in docker-compose.yml
```

#### 2. Permission Denied When Accessing Data Directory
**Problem**: `Error: Permission denied when accessing ./data directory`

**Solution**: 
```bash
# Ensure Docker has proper permissions
sudo chown -R $USER:$USER data/
chmod 755 data/
```

#### 3. MongoDB Connection Refused
**Problem**: `Error: Connection refused to MongoDB`

**Solution**: 
```bash
# Wait for container to fully start
sleep 15
# Check container logs
docker logs mongodb-lab
```

#### 4. Authentication Failed
**Problem**: `Error: Authentication failed`

**Solution**: 
```bash
# Verify credentials match docker-compose.yml
docker exec -it mongodb-lab mongosh -u admin -p password123
```

#### 5. Mongo Express Not Loading
**Problem**: Cannot access http://localhost:8081

**Solution**:
```bash
# Check if container is running
docker ps | grep mongo-express
# Check container logs
docker logs mongo-express
```

---

## Assessment Questions

After completing this lab, you should be able to answer:

1. **What are the advantages of document stores over relational databases for e-commerce applications?**

2. **How does MongoDB handle schema flexibility compared to traditional SQL databases?**

3. **What are the key differences between `insertOne()` and `insertMany()` operations?**

4. **How would you design a document structure for a social media platform using MongoDB?**

5. **What are the benefits of using aggregation pipelines over simple queries?**

6. **How does MongoDB's text search differ from traditional SQL LIKE queries?**

---

*This lab guide provides a comprehensive introduction to MongoDB document store database. The examples demonstrate real-world usage patterns and best practices for working with document-oriented data. The e-commerce scenario showcases how document stores excel at handling flexible, complex data structures that would be challenging in relational databases.* 