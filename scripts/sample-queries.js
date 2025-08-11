// Sample MongoDB queries for practice
// Run these queries in the MongoDB shell to practice different operations

// Switch to the ecommerce database
// use ecommerce_db

print("=== MongoDB Query Practice Script ===");
print("Run these queries one by one to practice MongoDB operations");
print("");

// 1. Basic Find Operations
print("1. Find all products:");
print("db.products.find()");
print("");

print("2. Find products in stock:");
print("db.products.find({ inStock: true })");
print("");

print("3. Find products by category:");
print("db.products.find({ category: 'Electronics' })");
print("");

print("4. Find products with price less than $100:");
print("db.products.find({ price: { $lt: 100 } })");
print("");

// 2. Projection Queries
print("5. Show only product names and prices:");
print("db.products.find({}, { name: 1, price: 1, _id: 0 })");
print("");

print("6. Find one specific product:");
print("db.products.findOne({ name: 'Wireless Bluetooth Headphones' })");
print("");

// 3. Update Operations
print("7. Update product price:");
print("db.products.updateOne({ name: 'Wireless Bluetooth Headphones' }, { $set: { price: 79.99 } })");
print("");

print("8. Add a new field to all products:");
print("db.products.updateMany({}, { $set: { lastUpdated: new Date() } })");
print("");

// 4. Delete Operations
print("9. Delete out-of-stock products:");
print("db.products.deleteMany({ inStock: false })");
print("");

// 5. Advanced Queries
print("10. Find products with specific tags:");
print("db.products.find({ tags: 'wireless' })");
print("");

print("11. Find products with nested object queries:");
print("db.products.find({ 'specifications.batteryLife': '20 hours' })");
print("");

print("12. Count total products:");
print("db.products.countDocuments()");
print("");

print("13. Find products sorted by price (ascending):");
print("db.products.find().sort({ price: 1 })");
print("");

print("14. Find products with price range:");
print("db.products.find({ price: { $gte: 50, $lte: 200 } })");
print("");

// 6. Aggregation Examples
print("15. Average price by category:");
print("db.products.aggregate([{ $group: { _id: '$category', avgPrice: { $avg: '$price' } } }])");
print("");

print("16. Count products by category:");
print("db.products.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])");
print("");

print("=== End of Practice Queries ===");
print("Try running these queries to understand MongoDB operations!"); 