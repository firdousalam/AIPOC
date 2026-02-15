import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-ai';

// Schemas
const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const companySchema = new mongoose.Schema({
    name: String,
    description: String,
    email: String,
    phone: String,
    website: String,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const distributorSchema = new mongoose.Schema({
    name: String,
    description: String,
    contactPerson: String,
    email: String,
    phone: String,
    address: String,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
    productId: { type: String, unique: true },
    name: String,
    description: String,
    category: String,
    company: String,
    distributor: String,
    price: Number,
    mrp: Number,
    salePrice: Number,
    discount: Number,
    stock: Number,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const saleSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    totalAmount: Number,
    customerName: String,
    customerEmail: String,
    paymentMethod: String,
    status: { type: String, default: 'completed' },
    saleDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const inventorySchema = new mongoose.Schema({
    productId: String,
    productName: String,
    quantity: Number,
    location: String,
    lastRestocked: Date,
    minStockLevel: Number,
    maxStockLevel: Number,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Models
const Category = mongoose.model('Category', categorySchema);
const Company = mongoose.model('Company', companySchema);
const Distributor = mongoose.model('Distributor', distributorSchema);
const Product = mongoose.model('Product', productSchema);
const Sale = mongoose.model('Sale', saleSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);

// Sample data
const categories = [
    { name: 'Electronics', description: 'Electronic devices and accessories' },
    { name: 'Clothing', description: 'Apparel and fashion items' },
    { name: 'Food & Beverages', description: 'Food products and drinks' },
    { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
    { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
    { name: 'Books & Media', description: 'Books, movies, and music' },
    { name: 'Health & Beauty', description: 'Health and beauty products' },
    { name: 'Toys & Games', description: 'Toys and gaming products' },
];

const companies = [
    { name: 'TechCorp', description: 'Leading electronics manufacturer', email: 'contact@techcorp.com', phone: '+1-555-0101', website: 'https://techcorp.com' },
    { name: 'FashionHub', description: 'Premium clothing brand', email: 'info@fashionhub.com', phone: '+1-555-0102', website: 'https://fashionhub.com' },
    { name: 'FreshFoods Inc', description: 'Organic food supplier', email: 'sales@freshfoods.com', phone: '+1-555-0103', website: 'https://freshfoods.com' },
    { name: 'HomeStyle', description: 'Home decor and furniture', email: 'support@homestyle.com', phone: '+1-555-0104', website: 'https://homestyle.com' },
    { name: 'SportsPro', description: 'Sports equipment manufacturer', email: 'contact@sportspro.com', phone: '+1-555-0105', website: 'https://sportspro.com' },
];

const distributors = [
    { name: 'Global Logistics', description: 'Worldwide distribution', contactPerson: 'John Smith', email: 'john@globallogistics.com', phone: '+1-555-0201', address: '123 Main St, New York, NY' },
    { name: 'FastShip Co', description: 'Express delivery services', contactPerson: 'Jane Doe', email: 'jane@fastship.com', phone: '+1-555-0202', address: '456 Oak Ave, Los Angeles, CA' },
    { name: 'Regional Supply', description: 'Regional distribution network', contactPerson: 'Bob Johnson', email: 'bob@regionalsupply.com', phone: '+1-555-0203', address: '789 Pine Rd, Chicago, IL' },
];

const products = [
    { name: 'Wireless Headphones', description: 'Premium noise-canceling headphones', category: 'Electronics', company: 'TechCorp', price: 149.99, mrp: 199.99, discount: 25 },
    { name: 'Smart Watch', description: 'Fitness tracking smartwatch', category: 'Electronics', company: 'TechCorp', price: 299.99, mrp: 399.99, discount: 25 },
    { name: 'Laptop Stand', description: 'Ergonomic aluminum laptop stand', category: 'Electronics', company: 'TechCorp', price: 49.99, mrp: 69.99, discount: 29 },
    { name: 'Cotton T-Shirt', description: 'Comfortable cotton t-shirt', category: 'Clothing', company: 'FashionHub', price: 19.99, mrp: 29.99, discount: 33 },
    { name: 'Denim Jeans', description: 'Classic fit denim jeans', category: 'Clothing', company: 'FashionHub', price: 59.99, mrp: 89.99, discount: 33 },
    { name: 'Running Shoes', description: 'Lightweight running shoes', category: 'Sports & Outdoors', company: 'SportsPro', price: 89.99, mrp: 129.99, discount: 31 },
    { name: 'Yoga Mat', description: 'Non-slip yoga mat', category: 'Sports & Outdoors', company: 'SportsPro', price: 29.99, mrp: 39.99, discount: 25 },
    { name: 'Organic Coffee', description: 'Premium organic coffee beans', category: 'Food & Beverages', company: 'FreshFoods Inc', price: 14.99, mrp: 19.99, discount: 25 },
    { name: 'Green Tea', description: 'Organic green tea leaves', category: 'Food & Beverages', company: 'FreshFoods Inc', price: 9.99, mrp: 14.99, discount: 33 },
    { name: 'Table Lamp', description: 'Modern LED table lamp', category: 'Home & Garden', company: 'HomeStyle', price: 39.99, mrp: 59.99, discount: 33 },
    { name: 'Throw Pillow', description: 'Decorative throw pillow', category: 'Home & Garden', company: 'HomeStyle', price: 24.99, mrp: 34.99, discount: 29 },
    { name: 'Face Cream', description: 'Anti-aging face cream', category: 'Health & Beauty', company: 'TechCorp', price: 34.99, mrp: 49.99, discount: 30 },
    { name: 'Shampoo', description: 'Natural ingredients shampoo', category: 'Health & Beauty', company: 'FreshFoods Inc', price: 12.99, mrp: 17.99, discount: 28 },
    { name: 'Board Game', description: 'Family strategy board game', category: 'Toys & Games', company: 'HomeStyle', price: 29.99, mrp: 39.99, discount: 25 },
    { name: 'Puzzle Set', description: '1000-piece jigsaw puzzle', category: 'Toys & Games', company: 'HomeStyle', price: 19.99, mrp: 24.99, discount: 20 },
];

const customerNames = [
    'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Edward Norton',
    'Fiona Apple', 'George Martin', 'Hannah Montana', 'Ian McKellen', 'Julia Roberts',
    'Kevin Hart', 'Laura Palmer', 'Michael Scott', 'Nancy Drew', 'Oscar Wilde',
    'Patricia Hill', 'Quincy Jones', 'Rachel Green', 'Samuel Jackson', 'Tina Fey',
];

const paymentMethods = ['credit_card', 'debit_card', 'paypal', 'cash', 'bank_transfer'];
const locations = ['Warehouse A', 'Warehouse B', 'Store 1', 'Store 2', 'Distribution Center'];

// Helper functions
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return new Date(start + Math.random() * (end - start));
}

// Generate data with dates
async function generateData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await Category.deleteMany({});
        await Company.deleteMany({});
        await Distributor.deleteMany({});
        await Product.deleteMany({});
        await Sale.deleteMany({});
        await Inventory.deleteMany({});

        // Calculate date ranges (past 4 months)
        const now = new Date();
        const fourMonthsAgo = new Date(now);
        fourMonthsAgo.setMonth(now.getMonth() - 4);

        // Insert categories
        console.log('Inserting categories...');
        const insertedCategories = await Category.insertMany(
            categories.map(cat => ({
                ...cat,
                createdAt: getRandomDate(fourMonthsAgo, now),
            }))
        );

        // Insert companies
        console.log('Inserting companies...');
        const insertedCompanies = await Company.insertMany(
            companies.map(comp => ({
                ...comp,
                createdAt: getRandomDate(fourMonthsAgo, now),
            }))
        );

        // Insert distributors
        console.log('Inserting distributors...');
        const insertedDistributors = await Distributor.insertMany(
            distributors.map(dist => ({
                ...dist,
                createdAt: getRandomDate(fourMonthsAgo, now),
            }))
        );

        // Insert products
        console.log('Inserting products...');
        const insertedProducts = [];
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const createdAt = getRandomDate(fourMonthsAgo, now);
            const productDoc = await Product.create({
                productId: `PROD-${String(i + 1).padStart(4, '0')}`,
                name: product.name,
                description: product.description,
                category: product.category,
                company: product.company,
                distributor: getRandomElement(distributors).name,
                price: product.price,
                mrp: product.mrp,
                salePrice: product.price,
                discount: product.discount,
                stock: getRandomInt(50, 500),
                createdAt,
                updatedAt: createdAt,
            });
            insertedProducts.push(productDoc);
        }

        console.log(`Inserted ${insertedProducts.length} products`);

        // Generate sales data (past 4 months)
        console.log('Generating sales data...');
        const sales = [];
        const salesPerDay = 15; // Average sales per day
        const totalDays = 120; // 4 months ≈ 120 days

        for (let day = 0; day < totalDays; day++) {
            const saleDate = new Date(fourMonthsAgo);
            saleDate.setDate(saleDate.getDate() + day);

            // Vary sales count per day (weekends might have more sales)
            const isWeekend = saleDate.getDay() === 0 || saleDate.getDay() === 6;
            const dailySales = isWeekend ? getRandomInt(20, 30) : getRandomInt(10, 20);

            for (let i = 0; i < dailySales; i++) {
                const product = getRandomElement(insertedProducts);
                const quantity = getRandomInt(1, 5);
                const unitPrice = product.salePrice || product.price || 0;
                const totalAmount = quantity * unitPrice;

                sales.push({
                    productId: product.productId,
                    productName: product.name,
                    quantity,
                    unitPrice,
                    totalAmount,
                    customerName: getRandomElement(customerNames),
                    customerEmail: `${getRandomElement(customerNames).toLowerCase().replace(' ', '.')}@example.com`,
                    paymentMethod: getRandomElement(paymentMethods),
                    status: 'completed',
                    saleDate: new Date(saleDate.getTime() + getRandomInt(0, 86400000)), // Random time during the day
                    createdAt: saleDate,
                    updatedAt: saleDate,
                });
            }
        }

        await Sale.insertMany(sales);
        console.log(`Inserted ${sales.length} sales records`);

        // Generate inventory data
        console.log('Generating inventory data...');
        const inventoryRecords = insertedProducts.map(product => ({
            productId: product.productId,
            productName: product.name,
            quantity: product.stock,
            location: getRandomElement(locations),
            lastRestocked: getRandomDate(fourMonthsAgo, now),
            minStockLevel: getRandomInt(10, 30),
            maxStockLevel: getRandomInt(200, 500),
            createdAt: product.createdAt,
            updatedAt: new Date(),
        }));

        await Inventory.insertMany(inventoryRecords);
        console.log(`Inserted ${inventoryRecords.length} inventory records`);

        // Summary
        console.log('\n=== Data Generation Summary ===');
        console.log(`Categories: ${insertedCategories.length}`);
        console.log(`Companies: ${insertedCompanies.length}`);
        console.log(`Distributors: ${insertedDistributors.length}`);
        console.log(`Products: ${insertedProducts.length}`);
        console.log(`Sales: ${sales.length}`);
        console.log(`Inventory Records: ${inventoryRecords.length}`);
        console.log(`Date Range: ${fourMonthsAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`);
        console.log('===============================\n');

        console.log('Sample data generated successfully!');
    } catch (error) {
        console.error('Error generating data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
generateData();
