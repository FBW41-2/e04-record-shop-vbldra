const User = require("../models/User");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const tokens = {}

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
    const token = req.headers.key
    const userData = req.body;

    const loggedInUser = tokens[req.headers.key]
    if (!token || !loggedInUser) {
        return next({message: "Permission denied. You have to log in"})
    }

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, userData, {
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
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();

        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.login = async (req, res, next) => {
    try {
        const userCredentials = req.body;
        const user = await User.findOne({
            email: userCredentials.email,
        }).select("+password");
        const password = user.password;
        const isCorrectPassword = await bcrypt.compare(
            userCredentials.password,
            password
        );
        if (isCorrectPassword) {
            const token = crypto.randomBytes(30).toString("hex");
            tokens[token] = user
            res.json({ message: "Congrats! You're logged in!", token: token});
        } else {
            next({ message: "Wrong password" });
        }
    } catch (e) {
        next(e);
    }
};
