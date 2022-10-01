const express = require('express');
const router = express.Router();
const incomeController = require("../controllers/incomeController");
const passport = require('passport');
const checkPermission = require('../config/checkPermission')

/**
 * @swagger
 * components:
 *   schemas:
 *     Income:
 *       type: object
 *       required:
 *         - source
 *         - date
 *         - amount
 *       properties:
 *         source:
 *           type: string
 *           description: The source of income
 *         date:
 *           type: string
 *           description: The date of income
 *         amount:
 *           type: number
 *           description: The income amount
 *       example:
 *         _id: 87309880938984993
 *         source: sales
 *         date: 2022-09-30
 *         amount: 500
 */

/**
  * @swagger
  * tags:
  *   name: Incomes
  *   description: The incomes managing API
*/

/**
 * @swagger
 * /api/income:
 *   get:
 *     summary: Returns the list of all the incomes
 *     tags: [Incomes]
 *     responses:
 *       200:
 *         description: The list of the incomes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               incomes:
 *                 $ref: '#/components/schemas/Income'
 */

router.get('/', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-income"),
    incomeController.getAllIncomes
);

/**
 * @swagger
 * /api/income/{id}:
 *   get:
 *     summary: Get the income by id
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The income id
 *     responses:
 *       200:
 *         description: The income record by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       404:
 *         description: The expense record was not found
 */

router.get('/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-income"),
    incomeController.getOneIncome
);

/**
 * @swagger
 * /api/income/add:
 *   post:
 *     summary: Create a new income record
 *     tags: [Incomes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *               amount:
 *                 type: integer
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: The income was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       500:
 *         description: Some server error
 */
  
router.post('/add', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("add-income"), 
    incomeController.addIncome
);

/**
 * @swagger
 * /api/income/update:
 *  patch:
 *    summary: Update the income by the id
 *    tags: [Incomes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              source:
 *                type: string
 *              id:
 *                type: string
 *              amount:
 *                type: integer
 *              date:
 *                type: string
 *    responses:
 *      200:
 *        description: The income was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Income'
 *      404:
 *        description: The income record was not found
 *      500:
 *        description: Some error happened
 */

router.patch('/update', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("update-income"), 
    incomeController.updateIncome
);

/**
 * @swagger
 * /api/income/delete/{id}:
 *   delete:
 *     summary: Remove the income by id
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The income id
 * 
 *     responses:
 *       200:
 *         description: The income was deleted
 *       404:
 *         description: The income was not found
 */

router.delete('/delete/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("delete-income"), 
    incomeController.deleteIncome
);


module.exports = router;