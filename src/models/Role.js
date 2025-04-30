const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],  // Permissions field
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
