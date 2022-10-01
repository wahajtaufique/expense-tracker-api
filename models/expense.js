const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const expenseSchema = new Schema(
	{
		category: {
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

expenseSchema.plugin(mongooseDelete, { overrideMethods: true });
const Expense = mongoose.model('expense', expenseSchema);
module.exports = Expense;
