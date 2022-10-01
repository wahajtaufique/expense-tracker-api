const Role = require("../models/role");
const User = require("../models/user");

const checkPermission = function (...name) {
	return async (req, res, next) => {
		try {
			const role = await Role.find({ _id: req.user.roleId._id });
			if (role[0].name === "superAdmin") {
				return next();
			}
			const isFound = req.user.roleId.permissions.includes(name[0]);
			isFound
				? next()
				: res.status(200).json({
					message: "You are not authorized to do that",
					status: false,
				});
		} catch (error) {
			return res.status(500).json({
				message: "You are not authorized to do that",
				status: false,
			});
		}
	}
}
module.exports = checkPermission;
