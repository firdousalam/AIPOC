const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai';
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db('enterprise-sales-ai');

    // Seed products
    const products = [
      {
        name: 'Product A',
        description: 'Sample product A',
        price: 99.99,
        category: 'Electronics',
        stock: 100,
      },
      {
        name: 'Product B',
        description: 'Sample product B',
        price: 149.99,
        category: 'Electronics',
        stock: 50,
      },
    ];

    await db.collection('products').insertMany(products);
    console.log('✅ Seeded products');

    // Seed sales
    const sales = [
      {
        productId: '1',
        productName: 'Product A',
        quantity: 5,
        price: 99.99,
        totalAmount: 499.95,
        saleDate: new Date(),
      },
    ];

    await db.collection('sales').insertMany(sales);
    console.log('✅ Seeded sales');

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();

