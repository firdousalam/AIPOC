import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-ai';

// New Sale Schema with multiple products
const saleSchema = new mongoose.Schema({
    items: [{
        productId: String,
        productName: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
    }],
    totalAmount: Number,
    saleDate: Date,
    customer: {
        name: String,
        email: String,
        mobile: String,
        panOrVoterId: String,
    },
    paymentMethod: String,
    notes: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    productId: String,
    name: String,
    price: Number,
    stock: Number,
});

// Models
const Sale = mongoose.model('Sale', saleSchema);
const Product = mongoose.model('Product', productSchema);

// Sample data
const customerNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
    'Anita Desai', 'Rahul Verma', 'Kavita Nair', 'Sanjay Gupta', 'Meera Iyer',
    'Arjun Mehta', 'Pooja Joshi', 'Karan Malhotra', 'Divya Kapoor', 'Rohan Das',
    'Neha Agarwal', 'Suresh Rao', 'Lakshmi Pillai', 'Aditya Khanna', 'Ritu Bansal',
    'Manoj Kumar', 'Swati Saxena', 'Deepak Chopra', 'Anjali Menon', 'Vishal Sinha',
    'Shruti Bose', 'Nikhil Jain', 'Preeti Mishra', 'Gaurav Pandey', 'Shweta Kulkarni',
    'Ashok Reddy', 'Nisha Thakur', 'Ramesh Iyer', 'Sunita Yadav', 'Prakash Nambiar',
    'Geeta Sharma', 'Harish Patel', 'Madhuri Deshmukh', 'Sunil Varma', 'Rekha Pillai',
];

const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cheque'];

const notes = [
    'Regular customer',
    'Bulk order discount applied',
    'Express delivery requested',
    'Gift wrapping included',
    'Corporate order',
    'Repeat purchase',
    'Seasonal sale',
    'Loyalty program member',
    'First time customer',
    'Referral discount applied',
];

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

function generatePhoneNumber(): string {
    const prefix = ['+91', '+1', '+44', '+61', '+65'];
    const number = Math.floor(1000000000 + Math.random() * 9000000000);
    return `${getRandomElement(prefix)}-${number}`;
}

function generatePanOrVoterId(): string {
    const type = Math.random() > 0.5 ? 'PAN' : 'VOTER';
    if (type === 'PAN') {
        // PAN format: ABCDE1234F
        const letters1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const letters2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const letters3 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const letters4 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const letters5 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const numbers = Math.floor(1000 + Math.random() * 9000);
        const letter6 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return `${letters1}${letters2}${letters3}${letters4}${letters5}${numbers}${letter6}`;
    } else {
        // Voter ID format: ABC1234567
        const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
            String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const numbers = Math.floor(1000000 + Math.random() * 9000000);
        return `${letters}${numbers}`;
    }
}

function generateEmail(name: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}@${getRandomElement(domains)}`;
}

// Generate sales data
async function generateSales() {
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

        // Date range: July 1, 2025 to February 16, 2026 (today)
        const startDate = new Date('2025-07-01T00:00:00.000Z');
        const endDate = new Date('2026-02-16T23:59:59.999Z');
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`Generating 1000 sales from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
        console.log(`Total days: ${totalDays}`);

        // Clear existing sales with new schema
        console.log('Clearing existing sales...');
        await Sale.deleteMany({});

        // Generate 1000 sales
        const sales = [];
        const salesPerDay = Math.ceil(1000 / totalDays);

        for (let i = 0; i < 1000; i++) {
            const saleDate = getRandomDate(startDate, endDate);

            // Determine number of items in this sale (1-5 products)
            const itemCount = getRandomInt(1, 5);
            const items = [];
            let totalAmount = 0;

            // Generate items for this sale
            for (let j = 0; j < itemCount; j++) {
                const product = getRandomElement(products);
                const quantity = getRandomInt(1, 10);
                const unitPrice = product.price || product.salePrice || 0;
                const totalPrice = quantity * unitPrice;

                items.push({
                    productId: product.productId || product._id.toString(),
                    productName: product.name,
                    quantity,
                    unitPrice,
                    totalPrice,
                });

                totalAmount += totalPrice;
            }

            // Generate customer info (80% of sales have customer info)
            const hasCustomerInfo = Math.random() > 0.2;
            let customer = undefined;

            if (hasCustomerInfo) {
                const customerName = getRandomElement(customerNames);
                const hasEmail = Math.random() > 0.3; // 70% have email
                const hasMobile = Math.random() > 0.2; // 80% have mobile
                const hasId = Math.random() > 0.5; // 50% have PAN/Voter ID

                customer = {
                    name: customerName,
                    email: hasEmail ? generateEmail(customerName) : undefined,
                    mobile: hasMobile ? generatePhoneNumber() : undefined,
                    panOrVoterId: hasId ? generatePanOrVoterId() : undefined,
                };
            }

            // Generate payment method (90% have payment method)
            const paymentMethod = Math.random() > 0.1 ? getRandomElement(paymentMethods) : undefined;

            // Generate notes (30% have notes)
            const hasNotes = Math.random() > 0.7;
            const saleNotes = hasNotes ? getRandomElement(notes) : undefined;

            sales.push({
                items,
                totalAmount,
                saleDate,
                customer,
                paymentMethod,
                notes: saleNotes,
                createdAt: saleDate,
                updatedAt: saleDate,
            });

            // Progress indicator
            if ((i + 1) % 100 === 0) {
                console.log(`Generated ${i + 1}/1000 sales...`);
            }
        }

        // Sort sales by date
        sales.sort((a, b) => a.saleDate.getTime() - b.saleDate.getTime());

        // Insert sales
        console.log('Inserting sales into database...');
        await Sale.insertMany(sales);

        // Calculate statistics
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const avgSaleAmount = totalRevenue / sales.length;
        const totalItems = sales.reduce((sum, sale) => sum + sale.items.length, 0);
        const avgItemsPerSale = totalItems / sales.length;
        const salesWithCustomers = sales.filter(s => s.customer).length;
        const salesWithPayment = sales.filter(s => s.paymentMethod).length;

        // Summary
        console.log('\n=== Sales Generation Summary ===');
        console.log(`Total Sales: ${sales.length}`);
        console.log(`Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
        console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);
        console.log(`Average Sale Amount: $${avgSaleAmount.toFixed(2)}`);
        console.log(`Total Items Sold: ${totalItems}`);
        console.log(`Average Items per Sale: ${avgItemsPerSale.toFixed(2)}`);
        console.log(`Sales with Customer Info: ${salesWithCustomers} (${(salesWithCustomers / sales.length * 100).toFixed(1)}%)`);
        console.log(`Sales with Payment Method: ${salesWithPayment} (${(salesWithPayment / sales.length * 100).toFixed(1)}%)`);
        console.log('================================\n');

        console.log('Sales data generated successfully!');
    } catch (error) {
        console.error('Error generating sales:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
generateSales();
