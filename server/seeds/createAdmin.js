/**
 * Admin Seeder — Creates the default EduConnect admin account.
 * Run: node server/seeds/createAdmin.js
 *
 * Default Credentials:
 *   Email:    admin@educonnect.lk
 *   Password: Admin@1234
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@educonnect.lk';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME = 'EduConnect Admin';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.DB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('ℹ️  Admin already exists:', ADMIN_EMAIL);
      console.log('   Role:', existing.role);
      process.exit(0);
    }

    const hashedPw = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPw,
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    console.log('\n🎉 Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email   :', ADMIN_EMAIL);
    console.log('  Password:', ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    process.exit(1);
  }
};

seed();
