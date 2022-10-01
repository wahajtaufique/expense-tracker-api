const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const incomeSchema = new Schema(
	{
		source: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			default: null,
			required: true
		},
		amount: {
			type: Number,
			default: null,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		}
	},
	{ timestamps: true }
);

incomeSchema.plugin(mongooseDelete, { overrideMethods: true });
const Income = mongoose.model('income', incomeSchema);
module.exports = Income;
