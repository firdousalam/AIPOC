import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function resetUsers() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai';
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Get user collection
        const User = mongoose.connection.collection('users');

        // Count existing users
        const count = await User.countDocuments();
        console.log(`📊 Found ${count} existing user(s)\n`);

        if (count === 0) {
            console.log('✅ No users to delete. Database is clean.\n');
        } else {
            // Show existing users
            console.log('👥 Existing users:');
            const users = await User.find({}).toArray();
            users.forEach((user: any) => {
                console.log(`   - ${user.email} (${user.name}) - ${user.userType}`);
            });

            // Delete all users
            console.log('\n🗑️  Deleting all users...');
            const result = await User.deleteMany({});
            console.log(`✅ Deleted ${result.deletedCount} user(s)\n`);
        }

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB\n');

        console.log('🎯 Next Steps:');
        console.log('   1. Run: pnpm seed:super-admin');
        console.log('   2. Login with: admin@example.com / Admin123!');
        console.log('   3. Create new users via the dashboard\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

console.log('⚠️  WARNING: This will delete ALL users from the database!\n');
console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

setTimeout(() => {
    resetUsers();
}, 3000);
