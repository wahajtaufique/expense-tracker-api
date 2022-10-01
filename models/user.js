const { mongo } = require('mongoose');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		roleId: {
			type: Schema.Types.ObjectId,
			ref: 'role',
			default: null
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "inactive",
		}
	},
	{ timestamps: true }
);

userSchema.plugin(mongooseDelete, { overrideMethods: true })
const User = mongoose.model('user', userSchema);
module.exports = User;
