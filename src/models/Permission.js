const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
  name: { type: String, required: true, unique: true },  // Permission name
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
