const User = require('../models/UserModel');
require('dotenv').config();

async function createAdminUser() {
  try {
    console.log('🔧 Initializing JSON Database...');

    // Check if admin user already exists
    const existingAdmin = await User.findByEmail(process.env.ADMIN_EMAIL || 'admin@venturedbrands.com');
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@venturedbrands.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('⚠️  Please change the default password after first login!');
    console.log('🎯 You can now access the admin dashboard at: http://localhost:5000/admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
