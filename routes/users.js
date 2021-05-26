const express = require("express");
const router = express.Router();
const { validateInputs } = require("../middleware/validator");
const { userValidationRules } = require("../lib/validation/userRules");
const auth = require("../middleware/authenticator");
const checkLogin = require("../middleware/checkLogin");
const checkAdmin = require("../middleware/checkAdminRole");
const { body } = require("express-validator");

const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addUser,
    login,
} = require("../controllers/usersController");

router
    .route("/")
    .get(auth, checkAdmin, getUsers)
    .post(validateInputs(userValidationRules), addUser);

router
    .route("/:id")
    .get(auth, getUser)
    .delete(auth, deleteUser)
    .put(auth, updateUser);

router.route("/login").post(login);

module.exports = router;
