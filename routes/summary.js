const express = require('express');
const router = express.Router();
const summaryController = require("../controllers/summaryController");
const passport = require('passport');
const checkPermission = require('../config/checkPermission')


/**
 * @swagger
 * components:
 *   schemas:
 *     Summary:
 *       type: object
 *       required:
 *         - end
 *         - filter
 *       properties:
 *         end:
 *           type: string
 *           description: The ending date
 *         filter:
 *           type: string
 *           description: The day/week/month/year before the ending date
 *       example:
 *         date: 2022-10-02
 *         filter: month
 */

/**
  * @swagger
  * tags:
  *   name: Summary
  *   description: The summary API
*/

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Returns the summary of expense/income
 *     parameters:
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: The end date 
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: The "day", "week", "month", "year" before the ending date.
 *     tags: [Summary]
 *     responses:
 *       200:
 *         description: The summary such as net profit, total income and total expense.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: integer
 *                 totalExpense:
 *                   type: integer
 *                 net:
 *                   type: integer
 *                 incomes:
 *                   type: array
 *                 expenses: 
 *                   type: array
 */

router.get('/', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-summary"),
    summaryController.getSummaryByFilter
);


module.exports = router;