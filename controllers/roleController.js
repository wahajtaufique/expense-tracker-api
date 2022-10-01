const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const mongoose = require("mongoose");
const logger = require('../config/logger')


exports.addRole = async (req, res) => {
	try {
        const {name, permissions} = req.body;
		const hasRole = await Role.findOne({ name });
		if (hasRole) {
			logger.log('error', "Role exists. Handled in addRole.");
			return res.status(200).json({
				message: "Role already exists",
				status: false,
			});
		}

		if (permissions.length === 0) {
			logger.log('error', "No permissions are defined. Handled in addRole.");
			return res.status(200).json({
				message: "No permissions are defined",
				status: false,
			});
		}

		const role = new Role({name, permissions});

		await role.save();
		const result = await Role.findById(role._id)
		logger.log('info', "Role created successfully. Handled in addRole.");
		return res.status(200).json({
			message: "Role created successfully",
			status: true,
			result,
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in addRole.");
		res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.getOneRole = async (req, res) => {
	try {
		const role = await Role.find({_id: req.params.id});
		if (role.length === 0) {
			logger.log('error', "No role found. Handled in getOneRole.");
			return res.status(200).json({
				message: "No role found",
				status: false,
			});
		}
		logger.log('info', "Role fetched. Handled in getOneRole.");
		return res.status(200).json({
			message: "Role fetched successfully",
			status: true,
			role
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in getOneRole.");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.getAllRoles = async (req, res) => {
	try {
		const roles = await Role.find();
		if (roles.length === 0) {
			logger.log('error', "No roles found. Handled in getAllRoles.");
			return res.status(200).json({
				message: "No roles are found",
				status: false,
			});
		}
		logger.log('info', "Roles fetched successfully. Handled in getAllRoles.");
		return res.status(200).json({
			message: "Roles fetched successfully",
			status: true,
			roles
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in getAllRoles.");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.deleteRole = async (req, res) => {
	try {
		const id = req.params.id;
		const role = await Role.find({ _id: id });
		if (role.length < 1) {
			logger.log('error', "Role not found. Handled in deleteRole.");
			return res.status(200).json({
				message: "Role not found!",
				status: false,
			});
		}
		let result = await Role.delete({ _id: id });
		logger.log('info', "Role deleted. Handled in deleteRole.");
		return res.status(200).json({
			message: "Role deleted successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in deleteRole.");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

