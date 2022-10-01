const express = require('express');
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const passport = require('passport');
const checkPermission = require('../config/checkPermission')

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - category
 *         - date
 *         - amount
 *       properties:
 *         category:
 *           type: string
 *           description: The category of expense
 *         date:
 *           type: string
 *           description: The date of expense
 *         amount:
 *           type: number
 *           description: The amount of expense
 *       example:
 *         _id: 87309880938984993
 *         category: Medical
 *         date: 2022-09-30
 *         amount: 500
 */

/**
  * @swagger
  * tags:
  *   name: Expenses
  *   description: The expenses managing API
*/

/**
 * @swagger
 * /api/expense:
 *   get:
 *     summary: Returns the list of all the expenses
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: The list of the expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               expenses:
 *                 $ref: '#/components/schemas/Expense'
 */

router.get('/', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-expense"),
    expenseController.getAllExpenses
);

/**
 * @swagger
 * /api/expense/{id}:
 *   get:
 *     summary: Get the expense by id
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The expense id
 *     responses:
 *       200:
 *         description: The expense record by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: The expense record was not found
 */
router.get('/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-expense"),
    expenseController.getOneExpense
);

/**
 * @swagger
 * /api/expense/add:
 *   post:
 *     summary: Create a new expense record
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               amount:
 *                 type: integer
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post('/add', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("add-expense"), 
    expenseController.addExpense
);

/**
 * @swagger
 * /api/expense/update:
 *  patch:
 *    summary: Update the expense by the id
 *    tags: [Expenses]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              category:
 *                type: string
 *              id:
 *                type: string
 *              amount:
 *                type: integer
 *              date:
 *                type: string
 *    responses:
 *      200:
 *        description: The expense was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Expense'
 *      404:
 *        description: The expense was not found
 *      500:
 *        description: Some error happened
 */
router.patch('/update', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("update-expense"), 
    expenseController.updateExpense
);

/**
 * @swagger
 * /api/expense/delete/{id}:
 *   delete:
 *     summary: Remove the expense by id
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The expense id
 * 
 *     responses:
 *       200:
 *         description: The expense was deleted
 *       404:
 *         description: The expense was not found
 */

router.delete('/delete/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("delete-expense"), 
    expenseController.deleteExpense
);


module.exports = router;