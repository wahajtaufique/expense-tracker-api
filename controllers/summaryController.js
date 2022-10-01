const Income = require("../models/income");
const Expense = require("../models/expense");
const mongoose = require("mongoose");
const moment = require('moment');
const logger = require('../config/logger')

function getSum(total, obj) {
    return total + Math.round(obj.amount);
  }

exports.getSummaryByFilter = async (req, res) => {
    try {
        const {end, filter = null} = req.query;
        if (end && !moment(end, "YYYY-MM-DD", true).isValid()) {
            logger.log('error', "Date must be in a format of YYYY-MM-DD. Handled in getSummaryByFilter");
			return res.status(200).json({
				message: "Date must be in a format of YYYY-MM-DD",
				status: false,
			});
		}

        if (!(filter === 'day' || filter === 'week' || filter === 'month' || filter === 'year')) {
            logger.log('error', "Only day/week/month/year filters are allowed. Handled in getSummaryByFilter");
            return res.status(200).json({
				message: "Only day/week/month/year filters are allowed",
				status: false,
			});
        }

        let current = moment(end).format('YYYY-MM-DD');
        let future = moment(current).subtract(1, filter).format('YYYY-MM-DD');
		const incomes = await Income.find({
            date: {
                $gte: future
            }
        })
        const expenses = await Expense.find({
            date: {
                $gte: future
            }
        })

        
        if (incomes.length === 0 && expenses.length === 0) {
            logger.log('error', "No records of income and expense. Handled in getSummaryByFilter");
			return res.status(200).json({
				message: "No records of income and expense",
				status: false,
			});
		}

        let totalExpense = expenses.reduce(getSum, 0);
        let totalIncome = incomes.reduce(getSum, 0);
        let net = totalIncome - totalExpense;

        logger.log('info', "Summary fetched successfully.")

		return res.status(200).json({
			message: "Summary fetched successfully",
			status: true,
            totalExpense,
            totalIncome,
            net,
			incomes,
            expenses
		});
	} catch (error) {
        logger.log('error', "Something went wrong in calculating summary")
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};