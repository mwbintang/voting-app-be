const mongoose = require('mongoose');
const seedRBACAndVotes = require('./rbacAndVoteSeeder');  // Import your RBAC and vote seeder
const connectDB = require('../models/index');

const seedAll = async () => {
  try {
    await connectDB()

    console.log('Seeding data...');
    await seedRBACAndVotes();  // Run RBAC and candidate seeder

    console.log('All seeders completed!');
    mongoose.connection.close();  // Close the connection after seeding
  } catch (err) {
    console.error('Error during seeding:', err);
    mongoose.connection.close();  // Close the connection in case of error
  }
};

seedAll();
