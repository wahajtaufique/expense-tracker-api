const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Income = require("../models/income");
const mongoose = require("mongoose");
const moment = require('moment');
const logger = require('../config/logger')

exports.addIncome = async (req, res) => {
	try {
        const {source, date, amount} = req.body;

		if (!moment(date, "YYYY-MM-DD", true).isValid()) {
			logger.log('error', "Date must be in a format of YYYY-MM-DD. Handled in addIncome.");
			return res.status(200).json({
				message: "Date must be in a format of YYYY-MM-DD",
				status: false,
			});
		}
		if (amount < 0) {
			logger.log('error', "Amount cannot be in minus. Handled in addIncome.");
			return res.status(200).json({
				message: "Amount cannot be in minus",
				status: false,
			});
		}
		if (source.length < 3) {
			logger.log('error', "Source must be a minimum of 3 characters long. Handled in addIncome.");
			return res.status(200).json({
				message: "Source must be a minimum of 3 characters long",
				status: false,
			});
		}
		
		const income = new Income({source, date, amount, userId: req.user._id});

		await income.save();
		const result = await Income.findById(income._id)
		logger.log('info', "Income added successfully. Handled in addIncome.");
		return res.status(200).json({
			message: "Income added successfully",
			status: true,
			result,
		});
	} catch (error) {
		logger.log('error', "Something went wrong. Handled in addIncome.");
		res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.getOneIncome = async (req, res) => {
	try {
		const income = await Income.find({_id: req.params.id});
		if (income.length === 0) {
			logger.log('error', "No income found. Handled in getOneIncome.");
			return res.status(200).json({
				message: "No income found",
				status: false,
			});
		}
		logger.log('info', "Income found. Handled in getOneIncome.");
		return res.status(200).json({
			message: "Income fetched successfully",
			status: true,
			income
		});
	} catch (error) {
		logger.log('error', "Something went wrong. Handled in getOneIncome.");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.getAllIncomes = async (req, res) => {
	try {
		const incomes = await Income.find();
		if (incomes.length === 0) {
			logger.log('error', "No incomes found. Handled in getAllIncomes.");
			return res.status(200).json({
				message: "No incomes are found",
				status: false,
			});
		}
		logger.log('info', "incomes found. Handled in getAllIncomes.");
		return res.status(200).json({
			message: "Incomes fetched successfully",
			status: true,
			incomes
		});
	} catch (error) {
		logger.log('error', "something went wrong. Handled in getAllIncomes.");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.updateIncome = async (req, res) => {
	try {
		const id = req.body.id;

		if (req.body.date && !moment(req.body.date, "YYYY-MM-DD", true).isValid()) {
			logger.log('error', "Date must be in a format of YYYY-MM-DD. Handled in updateIncome.");
			return res.status(200).json({
				message: "Date must be in a format of YYYY-MM-DD",
				status: false,
			});
		}
		if (req.body.amount && req.body.amount < 0) {
			logger.log('error', "Amount cannot be in minus.");
			return res.status(200).json({
				message: "Amount cannot be in minus",
				status: false,
			});
		}
		if (req.body.source && req.body.source.length < 3) {
			logger.log('error', "Source must be a minimum of 3 characters long.");
			return res.status(200).json({
				message: "Source must be a minimum of 3 characters long",
				status: false,
			});
		}

		let updateObj = {
			...req.body
		}
		delete updateObj.id;
		
		const income = await Income.updateOne({_id: id}, {
			$set: {
				...req.body
			}
		})
		logger.log('info', "Income updated successfully. Handled in updateIncome");
		return res.status(200).json({
			message: "Income updated successfully",
			status: true,
		});
	} catch (error) {
		logger.log('error', "Something went wrong!. Handled in updateIncome");
		res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.deleteIncome = async (req, res) => {
	try {
		const id = req.params.id;
		const income = await Income.find({ _id: id });
		if (income.length < 1) {
			logger.log('error', "no income found!. Handled in deleteIncome");
			return res.status(200).json({
				message: "Income not found!",
				status: false,
			});
		}
		let result = await Income.delete({ _id: id });
		logger.log('info', "income deleted. Handled in deleteIncome");

		return res.status(200).json({
			message: "Income deleted successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "something wrong. Handled in deleteIncome");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

