const User = require("../models/User");
const createError = require("http-errors");
const { validationResult } = require("express-validator");

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-password -__v")
            .sort("lastName")
            .limit(5);
        res.status(200).send(users);
    } catch (e) {
        next(e);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select(
            "-password -__v"
        );
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.addUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const user = new User(req.body);
        const token = user.generateAuthToken();
        await user.save();
        const data = user.getPublicFields();
        res.status(200).header("x-auth", token).send(data);
    } catch (e) {
        next(e);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const allUsers = await User.find();
        const user = await User.findOne({ email });
        if (!user) throw new createError.NotFound("User not found");
        const valid = await user.checkPassword(password);
        if (!valid) throw new createError(401, "Password incorrect");

        const data = user.getPublicFields();
        const token = user.generateAuthToken();

        res.status(200).header("x-auth", token).send(data);
    } catch (e) {
        next(e);
    }
};
