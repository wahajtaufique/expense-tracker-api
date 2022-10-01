const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Expense = require("../models/expense");
const mongoose = require("mongoose");
const moment = require('moment');
const logger = require('../config/logger')

exports.addExpense = async (req, res) => {
	try {
        const {category, date, amount} = req.body;

		if (!moment(date, "YYYY-MM-DD", true).isValid()) {
			logger.log('error', "Date must be in a format of YYYY-MM-DD. Handled in addExpense");
			return res.status(200).json({
				message: "Date must be in a format of YYYY-MM-DD",
				status: false,
			});
		}
		if (amount < 0) {
			logger.log('error', "Amount cannot be in minus. Handled in addExpense");
			return res.status(200).json({
				message: "Amount cannot be in minus",
				status: false,
			});
		}
		if (category.length < 3) {
			logger.log('error', "Category must be a minimum of 3 characters long. Handled in addExpense");
			return res.status(200).json({
				message: "Category must be a minimum of 3 characters long",
				status: false,
			});
		}
		
		const expense = new Expense({category, date, amount, userId: req.user._id});

		await expense.save();
		const result = await Expense.findById(expense._id)
		logger.log('info', "Expense added successfully. Handled in addExpense");
		return res.status(200).json({
			message: "Expense added successfully",
			status: true,
			result,
		});
	} catch (error) {
		logger.log('error', "Something went wrong. Handled in addExpense");
		res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.getAllExpenses = async (req, res) => {
	try {
		const expenses = await Expense.find();
		if (expenses.length === 0) {
			logger.log('error', "No expenses are found. Handled in getAllExpenses");
			return res.status(200).json({
				message: "No expenses are found",
				status: false,
			});
		}
		logger.log('info', "Expenses fetched successfully. Handled in getAllExpenses");
		return res.status(200).json({
			message: "Expenses fetched successfully",
			status: true,
			expenses
		});
	} catch (error) {
		logger.log('error', "Something went wrong. Handled in getAllExpenses");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.getOneExpense = async (req, res) => {
	try {
		const expense = await Expense.find({_id: req.params.id});
		if (expense.length === 0) {
			logger.log('error', "No expense found. Handled in getOneExpense");
			return res.status(404).json({
				message: "No expense found",
				status: false,
			});
		}
		logger.log('info', "Expense fetched successfully. Handled in getOneExpense");
		return res.status(200).json({
			message: "Expense fetched successfully",
			status: true,
			expense
		});
	} catch (error) {
		logger.log('error', "Something went wrong!. Handled in getOneExpense");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.updateExpense = async (req, res) => {
	try {
		const id = req.body.id;

		if (req.body.date && !moment(req.body.date, "YYYY-MM-DD", true).isValid()) {
			logger.log('error', "Date must be in a format of YYYY-MM-DD. Handled in updateExpense");
			return res.status(200).json({
				message: "Date must be in a format of YYYY-MM-DD",
				status: false,
			});
		}
		if (req.body.amount && req.body.amount < 0) {
			logger.log('error', "Amount cannot be in minus. Handled in updateExpense");
			return res.status(200).json({
				message: "Amount cannot be in minus",
				status: false,
			});
		}
		if (req.body.category && req.body.category.length < 3) {
			logger.log('error', "Category must be a minimum of 3 characters long. Handled in updateExpense");
			return res.status(200).json({
				message: "Category must be a minimum of 3 characters long",
				status: false,
			});
		}

		let updateObj = {
			...req.body
		}
		delete updateObj.id;
		
		const expense = await Expense.updateOne({_id: id}, {
			$set: {
				...req.body
			}
		})
		logger.log('info', "Expense updated successfully. Handled in updateExpense");
		return res.status(200).json({
			message: "Expense updated successfully",
			status: true,
		});
	} catch (error) {
		logger.log('error', "Something went wrong!. Handled in updateExpense");
		res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.deleteExpense = async (req, res) => {
	try {
		const id = req.params.id;
		const expense = await Expense.find({ _id: id });
		if (expense.length < 1) {
			logger.log('error', "Expense not found. Handled in deleteExpense");
			return res.status(200).json({
				message: "Expense not found!",
				status: false,
			});
		}
		let result = await Expense.delete({ _id: id });
		logger.log('info', "Expense deleted. Handled in deleteExpense");
		return res.status(200).json({
			message: "Expense deleted successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in deleteExpense");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

