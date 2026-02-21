import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-ai';

// Inventory Schema
const inventorySchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 10 },
    location: String,
    lastRestocked: Date,
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    productId: String,
    name: String,
    costPrice: Number,
    stock: Number,
});

// Models
const Inventory = mongoose.model('InventoryItem', inventorySchema);
const Product = mongoose.model('Product', productSchema);

// Sample locations
const locations = [
    'Warehouse A - Shelf 1',
    'Warehouse A - Shelf 2',
    'Warehouse A - Shelf 3',
    'Warehouse B - Shelf 1',
    'Warehouse B - Shelf 2',
    'Warehouse B - Shelf 3',
    'Store Front - Display 1',
    'Store Front - Display 2',
    'Store Front - Display 3',
    'Storage Room - Section A',
    'Storage Room - Section B',
    'Storage Room - Section C',
    'Back Office',
    'Loading Dock',
    'Cold Storage',
];

// Helper functions
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(daysAgo: number): Date {
    const now = new Date();
    const past = new Date(now);
    past.setDate(past.getDate() - daysAgo);
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

// Generate inventory data
async function generateInventory() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Fetch all products
        console.log('Fetching products...');
        const products = await Product.find({ status: 'active' }).lean();

        if (products.length === 0) {
            console.error('No products found! Please run generate-sample-data.ts first.');
            return;
        }

        console.log(`Found ${products.length} products`);

        // Clear existing inventory
        console.log('Clearing existing inventory...');
        await Inventory.deleteMany({});

        // Determine how many inventory entries to create
        const targetCount = Math.min(100, products.length);
        console.log(`Generating ${targetCount} inventory entries...`);

        const inventoryEntries = [];

        // Create inventory for each product (up to 100)
        for (let i = 0; i < targetCount; i++) {
            const product = products[i];

            // Generate realistic stock quantities
            // 10% out of stock
            // 20% low stock (1-10 units)
            // 30% medium stock (11-50 units)
            // 40% high stock (51-500 units)
            const rand = Math.random();
            let quantity: number;
            let reorderLevel: number;

            if (rand < 0.1) {
                // Out of stock
                quantity = 0;
                reorderLevel = getRandomInt(5, 15);
            } else if (rand < 0.3) {
                // Low stock
                quantity = getRandomInt(1, 10);
                reorderLevel = getRandomInt(10, 20);
            } else if (rand < 0.6) {
                // Medium stock
                quantity = getRandomInt(11, 50);
                reorderLevel = getRandomInt(10, 15);
            } else {
                // High stock
                quantity = getRandomInt(51, 500);
                reorderLevel = getRandomInt(20, 30);
            }

            // Last restocked date (within last 90 days, or null if out of stock)
            const lastRestocked = quantity > 0 ? getRandomDate(90) : undefined;

            inventoryEntries.push({
                productId: product._id.toString(),
                productName: product.name,
                quantity,
                reorderLevel,
                location: getRandomElement(locations),
                lastRestocked,
                status: 'active',
            });

            // Progress indicator
            if ((i + 1) % 10 === 0) {
                console.log(`Generated ${i + 1}/${targetCount} inventory entries...`);
            }
        }

        // Insert inventory entries
        console.log('Inserting inventory entries into database...');
        await Inventory.insertMany(inventoryEntries);

        // Calculate statistics
        const totalQuantity = inventoryEntries.reduce((sum, item) => sum + item.quantity, 0);
        const outOfStock = inventoryEntries.filter(item => item.quantity === 0).length;
        const lowStock = inventoryEntries.filter(item => item.quantity > 0 && item.quantity <= item.reorderLevel).length;
        const inStock = inventoryEntries.filter(item => item.quantity > item.reorderLevel).length;
        const avgQuantity = totalQuantity / inventoryEntries.length;

        // Calculate total value (if cost price available)
        let totalValue = 0;
        for (const entry of inventoryEntries) {
            const product = products.find(p => p._id.toString() === entry.productId);
            if (product && product.costPrice) {
                totalValue += entry.quantity * product.costPrice;
            }
        }

        // Summary
        console.log('\n=== Inventory Generation Summary ===');
        console.log(`Total Entries: ${inventoryEntries.length}`);
        console.log(`Total Quantity: ${totalQuantity} units`);
        console.log(`Average Quantity: ${avgQuantity.toFixed(2)} units per product`);
        console.log(`\nStock Status:`);
        console.log(`  🔴 Out of Stock: ${outOfStock} (${(outOfStock / inventoryEntries.length * 100).toFixed(1)}%)`);
        console.log(`  🟡 Low Stock: ${lowStock} (${(lowStock / inventoryEntries.length * 100).toFixed(1)}%)`);
        console.log(`  🟢 In Stock: ${inStock} (${(inStock / inventoryEntries.length * 100).toFixed(1)}%)`);
        console.log(`\nTotal Inventory Value: ₹${totalValue.toFixed(2)}`);
        console.log(`\nLocations Used: ${new Set(inventoryEntries.map(e => e.location)).size}`);
        console.log('====================================\n');

        console.log('Inventory data generated successfully!');
    } catch (error) {
        console.error('Error generating inventory:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
generateInventory();
