const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const User = require("../models/user");
const mongoose = require("mongoose");
const logger = require('../config/logger')


exports.registerUser = async (req, res) => {
	try {
        const {email, name, password, confirm_pass} = req.body;
		const hasUser = await User.findOne({ email });
		const deletedUser = await User.findOneDeleted({ email });
		if (hasUser || deletedUser) {
			logger.log('error', "Email already exists. Handled in registerUser");
			return res.status(200).json({
				message: "Email already exists",
				status: false,
			});
		}
        if (password !== confirm_pass) {
			logger.log('error', "Your new password is not equal to confirm password.. Handled in registerUser");
			return res.status(200).json({
				message: "Your new password is not equal to confirm password.",
				status: false,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			name, email,
			password: hashedPassword
		});

		await user.save();
		const result = await User.findById(user._id).select("-password");
		logger.log('info', "Successfully created user. Handled in registerUser");
		return res.status(200).json({
			message: "User created successfully",
			status: true,
			result,
		});
	} catch (error) {
		logger.log('error', "Something went wrong. Handled in registerUser");
		res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password');
		if (users.length === 0) {
			logger.log('error', "No users are registered. Handled in getAllUsers");
			return res.status(200).json({
				message: "No users are registered",
				status: false,
			});
		}
		logger.log('info', "Users fetched. Handled in getAllUsers");
		return res.status(200).json({
			message: "Users fetched successfully",
			status: true,
			users
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in getAllUsers");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.getOneUser = async (req, res) => {
	try {
		const user = await User.find({_id: req.params.id}).select('-password');
		if (user.length === 0) {
			logger.log('error', "No user found. Handled in getOneUser");
			return res.status(200).json({
				message: "No user found",
				status: false,
			});
		}
		logger.log('info', "User fetched successfully. Handled in getOneUser");
		return res.status(200).json({
			message: "User fetched successfully",
			status: true,
			user
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in getOneUser");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
}

exports.userLogin = async (req, res) => {
	try {
		const user = await User.find({ email: req.body.email });
		if (user.length < 1) {
			logger.log('error', "Email not found. Handled in userLogin");
			return res.status(200).json({
				message: "Email not found!",
				status: false,
			});
		} else if (user[0]?.status === "inactive") {
			logger.log('error', "You are inactive, Please contact your administrator!");
			return res.status(200).json({
				message: "You are inactive, Please contact your administrator!",
				status: false,
			});
		}
		const result = await bcrypt.compare(req.body.password, user[0].password);
		if (!result) {
			logger.log('error', "Email and password may be incorrect.");
			return res.status(200).json({
				message: "Email and password may be incorrect!",
				status: false,
			});
		}
        let role;

        if (user[0].roleId) {
            role = await Role.findById(user[0].roleId);
        }

		const token = jwt.sign(
			{
				name: user[0].name,
				email: user[0].email,
				id: user[0]._id,
			},
			process.env.JWTSECRETKEY,
			{
				expiresIn: "60d",
			}
		);

		//set user online on login 
		logger.log('info', "Login successful. Handled in userLogin");
		return res.status(200).json({
			message: "Login successfully",
			token,
			name: user[0].name,
			role: role?.name || null,
			status: true,
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in userLogin");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.approveUser = async (req, res) => {
	try {
		const {email, userRole} = req.body;
		const user = await User.find({ email });
		if (user.length < 1) {
			logger.log('error', "Email not found!. Handled in approveUser");
			return res.status(200).json({
				message: "Email not found!",
				status: false,
			});
		}
		const role = await Role.find({name: userRole});

		let result = await User.updateOne({ email }, {
			$set: {
				roleId: role[0]._id,
				status: "active"
			}
		})

		logger.log('info', "Approved. Handled in approveUser");
		return res.status(200).json({
			message: "User approved successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in approveUser");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.deactivateUser = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.find({ email });
		if (user.length < 1) {
			logger.log('error', "Email not found!. Handled in deactivateUser");
			return res.status(200).json({
				message: "Email not found!",
				status: false,
			});
		}
		let result = await User.updateOne({ email }, {
			$set: {
				status: "inactive"
			}
		})
		logger.log('info', "Deactivated. Handled in deactivateUser");
		return res.status(200).json({
			message: "User deactivated successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "Something wrong!. Handled in deactivateUser");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.activateUser = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.find({ email });
		if (user.length < 1) {
			logger.log('error', "Email not found!. Handled in activateUser");
			return res.status(200).json({
				message: "Email not found!",
				status: false,
			});
		}
		let result = await User.updateOne({ email }, {
			$set: {
				status: "active"
			}
		})
		logger.log('info', "User activated successfully. Handled in activateUser");

		return res.status(200).json({
			message: "User activated successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in activateUser");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.find({ _id: id });
		if (user.length < 1) {
			logger.log('error', "User not found!. Handled in deleteUser");
			return res.status(200).json({
				message: "User not found!",
				status: false,
			});
		}
		let result = await User.delete({ _id: id });
		logger.log('info', "User deleted!. Handled in deleteUser");
		return res.status(200).json({
			message: "User deleted successfully",
			status: true
		});
	} catch (error) {
		logger.log('error', "Something wrong. Handled in deleteUser");
		return res.status(500).json({
			message: "Something went wrong!",
			status: false,
			error: error,
		});
	}
};

