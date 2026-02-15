import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    try {
        // Check if super admin already exists
        const existingAdmin = await usersService.findByEmail('admin@example.com');

        if (existingAdmin) {
            console.log('Super admin already exists!');
            console.log('Email: admin@example.com');
            await app.close();
            return;
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        await usersService.create({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            userType: 'super',
        });

        console.log('✅ Super admin created successfully!');
        console.log('Email: admin@example.com');
        console.log('Password: Admin123!');
        console.log('User Type: super');
        console.log('\n⚠️  Please change the password after first login!');
    } catch (error) {
        console.error('Error creating super admin:', error);
    }

    await app.close();
}

bootstrap();
