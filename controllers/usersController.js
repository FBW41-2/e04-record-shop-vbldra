const User = require("../models/User")

exports.getUsers = (req, res, next) => {
    User.find((err, users) => {
        if (err) return console.error(err);
        res.json(users);
    });
};

exports.getUser = (req, res, next) => {
    const { id } = req.params;
    User.findById(id, (err, entry) => {
        if (err) return res.json({ error: err });
        res.json(entry);
    });
};

exports.deleteUser = (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndRemove(id, (err, entry) => {
        if (err) return res.json({ error: err });
        res.json({ deleted: entry });
    });
};

exports.updateUser = (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body, { new: true }, (err, entry) => {
        if (err) return { error: err };
        res.json(entry);
    });
};

exports.addUser = (req, res, next) => {
    User.create(req.body, (err, entry) => {
        if (err) return res.json({ error: err });
        res.json(entry);
    });
};
