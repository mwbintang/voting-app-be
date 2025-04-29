const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Models
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

async function seedRBACVoting() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Permissions
    const permissionsMap = {
      admin: ['manage_users', 'view_votes', 'view_results'],
      voter: ['vote_existing', 'vote_custom']
    };

    const allPermissionNames = [...new Set(Object.values(permissionsMap).flat())];
    const allPermissions = await Promise.all(allPermissionNames.map(async (name) => {
      let perm = await Permission.findOne({ name });
      if (!perm) {
        perm = await Permission.create({ name, description: `${name} permission` });
        console.log(`Created permission: ${name}`);
      }
      return perm;
    }));

    // 2. Roles
    const rolesData = Object.entries(permissionsMap);
    const roles = [];

    for (const [roleName, permissionNames] of rolesData) {
      const perms = allPermissions.filter(p => permissionNames.includes(p.name)).map(p => p._id);
      let role = await Role.findOne({ name: roleName });
      if (!role) {
        role = await Role.create({
          name: roleName,
          description: `${roleName} role`,
          permissions: perms
        });
        console.log(`Created role: ${roleName}`);
      }
      roles.push(role);
    }

    // 3. Users
    const users = [
      {
        name: 'Admin One',
        email: 'admin@vote.com',
        password: 'admin123',
        roleName: 'admin'
      },
      {
        name: 'Voter One',
        email: 'voter@vote.com',
        password: 'voter123',
        roleName: 'voter'
      }
    ];

    for (const { name, email, password, roleName } of users) {
      const existing = await User.findOne({ email });
      if (!existing) {
        const hashed = await bcrypt.hash(password, 10);
        const role = roles.find(r => r.name === roleName);
        await User.create({
          name,
          email,
          password: hashed,
          roles: [role._id]
        });
        console.log(`Created user: ${email} (${roleName})`);
      } else {
        console.log(`User already exists: ${email}`);
      }
    }

    await mongoose.disconnect();
    console.log('🌱 Seeding completed and MongoDB disconnected');
  } catch (err) {
    console.error('❌ Seeder error:', err);
    await mongoose.disconnect();
  }
}

seedRBACVoting();