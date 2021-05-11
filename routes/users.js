const express = require("express");
const router = express.Router();
const userValidators = require("../lib/validation/userRules");
const generateValidator = require("../middleware/validator");

const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addUser,
} = require("../controllers/usersController");

router.route("/").get(getUsers).post(generateValidator(userValidators), addUser);

router.route("/:id").get(getUser).delete(deleteUser).put(updateUser);

module.exports = router;
