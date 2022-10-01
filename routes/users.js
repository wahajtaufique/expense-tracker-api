const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require('passport');
const checkPermission = require('../config/checkPermission')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email (unique) of the user
 *         password:
 *           type: string
 *           description: The password of the user account
 *       example:
 *         _id: 87309880938984993
 *         name: Wahaj
 *         email: wahajdev@gmail.com
 *         password: simplied
 */

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
*/

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               users:
 *                 $ref: '#/components/schemas/User'
 */


router.get('/', 
            passport.authenticate('jwt', {session: false}), 
            checkPermission("view-users"),
            userController.getAllUsers
        );

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user record by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user record was not found
 */

router.get('/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-users"),
    userController.getOneUser
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login to the app and get token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
 
router.post('/login',  userController.userLogin);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user with inactive status
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/users/admin/approve:
 *  patch:
 *    summary: Update the user status and role
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              userRole:
 *                type: string
 *    responses:
 *      200:
 *        description: The user is approved
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The User was not found
 *      500:
 *        description: Some error happened
 */

router.patch('/admin/approve', 
        passport.authenticate('jwt', {session: false}), 
        checkPermission("update-user"), 
        userController.approveUser
    );

/**
 * @swagger
 * /api/users/admin/deactivate:
 *  patch:
 *    summary: set the user inactive
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: The user was deactivated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.patch('/admin/deactivate', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("update-user"), 
    userController.deactivateUser
);

/**
 * @swagger
 * /api/users/admin/activate:
 *  patch:
 *    summary: Update the expense by the id
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *    responses:
 *      200:
 *        description: The user is now active
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.patch('/admin/activate', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("update-user"), 
    userController.activateUser
);

/**
 * @swagger
 * /api/users/admin/delete/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

router.delete('/admin/delete/:id',
    passport.authenticate('jwt', {session: false}),
    checkPermission("delete-user"),
    userController.deleteUser
);

module.exports = router;