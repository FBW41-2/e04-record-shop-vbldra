const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) throw new Error("Users not found");
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndRemove(id);
        if (!user) throw new Error("Cannot delete. User not found");
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) throw new Error("Cannot update. User not found");
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.addUser = async (req, res, next) => {
    try {
        const user = await User.create();
        if (!user) throw new Error("Cannot add new user");
        res.json(user);
    } catch (error) {
        next(error);
    }
};
