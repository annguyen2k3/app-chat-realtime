const User = require("../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    req.session.user = await User.findById(req.session.user._id).lean();
    next();
};
