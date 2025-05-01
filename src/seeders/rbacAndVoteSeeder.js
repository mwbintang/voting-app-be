const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote')

const seedRBACAndVotes = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Candidate.deleteMany({});
    await Vote.deleteMany({});

    // Create Permissions
    const permissions = await Permission.insertMany([
      { name: 'view_votes' },
      { name: 'create_vote' },
      { name: 'view_users' },
      { name: 'view_all_votes' },
      { name: 'view_candidates' },
      { name: 'delete_user' },
      { name: 'add_candidate' },
      { name: 'delete_candidate' },
      { name: 'change_role_user' }
    ]);

    const getPermissionId = (name) => permissions.find(p => p.name === name)._id;

    // Create Roles
    const adminRole = await Role.create({
      name: 'admin',
      permissions: [
        getPermissionId('view_users'),
        getPermissionId('view_all_votes'),
        getPermissionId('view_candidates'),
        getPermissionId('delete_user'),
        getPermissionId('add_candidate'),
        getPermissionId('delete_candidate'),
        getPermissionId('change_role_user'),
      ],
    });

    const userRole = await Role.create({
      name: 'user',
      permissions: [
        getPermissionId('view_votes'),
        getPermissionId('create_vote'),
      ],
    });

    // Create Users
    const adminUser = await User.create({
      username: 'adminUser',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminPassword', 10),
      role: [adminRole._id],
    });

    await User.create({
      username: 'regularUser',
      email: 'user@example.com',
      password: await bcrypt.hash('userPassword', 10),
      role: [userRole._id],
    });

    // Create Candidates
    const candidates = [
      { name: 'Alice', createdBy: adminUser._id },
      { name: 'Bob', createdBy: adminUser._id },
      { name: 'Charlie', createdBy: adminUser._id },
      { name: 'David', createdBy: adminUser._id },
    ];

    await Candidate.insertMany(candidates);

    console.log('✅ RBAC and Vote Seeder completed!');
  } catch (err) {
    console.error('❌ Error seeding RBAC and candidates:', err);
    process.exit(1);
  }
};

module.exports = seedRBACAndVotes;
