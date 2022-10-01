const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const roleSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		permissions: {
			type: Array,
			default: []
		},
	},
	{ timestamps: true }
);

roleSchema.plugin(mongooseDelete, { overrideMethods: true });
const Role = mongoose.model('role', roleSchema);
module.exports = Role;
