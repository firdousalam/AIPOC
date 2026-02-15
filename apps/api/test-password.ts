import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPassword() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Get user collection
        const User = mongoose.connection.collection('users');

        // Find user by email
        const email = 'test@test.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found with email:', email);
            console.log('\n💡 Available users:');
            const allUsers = await User.find({}).toArray();
            allUsers.forEach((u: any) => {
                console.log(`   - ${u.email} (${u.name})`);
            });
            process.exit(1);
        }

        console.log('\n✅ User found:');
        console.log('   Email:', user.email);
        console.log('   Name:', user.name);
        console.log('   User Type:', user.userType);
        console.log('   Password Hash:', user.password.substring(0, 20) + '...');

        // Test password
        const testPassword = 'password123';
        console.log('\n🔍 Testing password:', testPassword);

        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('   Result:', isValid ? '✅ VALID' : '❌ INVALID');

        if (!isValid) {
            console.log('\n💡 Possible issues:');
            console.log('   1. Password in database is not "password123"');
            console.log('   2. Password was not hashed with bcrypt');
            console.log('   3. Password hash is corrupted');
            console.log('\n🔧 To fix:');
            console.log('   1. Create a new user via the API');
            console.log('   2. Or run: pnpm seed:super-admin');
            console.log('   3. Or update password manually (see below)');

            // Generate correct hash
            const correctHash = await bcrypt.hash(testPassword, 10);
            console.log('\n📝 Correct hash for "password123":');
            console.log('   ', correctHash);
            console.log('\n   To update in MongoDB:');
            console.log(`   db.users.updateOne({ email: "${email}" }, { $set: { password: "${correctHash}" } })`);
        } else {
            console.log('\n✅ Password is correct! Login should work.');
            console.log('\n🔧 If login still fails:');
            console.log('   1. Restart the backend server');
            console.log('   2. Check backend logs for errors');
            console.log('   3. Verify LocalStrategy is working');
        }

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testPassword();
