const express = require('express');
const router = express.Router();
const roleController = require("../controllers/roleController");
const passport = require('passport');
const checkPermission = require('../config/checkPermission')

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - permissions
 *       properties:
 *         name:
 *           type: string
 *           description: The name of role
 *         permissions:
 *           type: array
 *           description: The array of strings containining permissions
 *       example:
 *         _id: 87309880938984993
 *         name: "guest"
 *         permissions: ["view-page"]
 */

/**
  * @swagger
  * tags:
  *   name: Roles
  *   description: The roles managing API
*/

/**
 * @swagger
 * /api/roles/:
 *   get:
 *     summary: Returns the list of all the roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: The list of the roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               expenses:
 *                 $ref: '#/components/schemas/Role'
 */


router.get('/', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-roles"),
    roleController.getAllRoles
);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get the role by id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: The role record was not found
 */

router.get('/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("view-roles"),
    roleController.getOneRole
);

/**
 * @swagger
 * /api/roles/add:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *     responses:
 *       200:
 *         description: The role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Some server error
 */
  
router.post('/add', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("add-roles"), 
    roleController.addRole
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Remove the role by id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 * 
 *     responses:
 *       200:
 *         description: The role was deleted
 *       404:
 *         description: The role was not found
 */

router.delete('/delete/:id', 
    passport.authenticate('jwt', {session: false}), 
    checkPermission("delete-roles"), 
    roleController.deleteRole
);


module.exports = router;