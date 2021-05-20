const express = require("express");
const router = express.Router();
const { validateInputs } = require("../middleware/validator");
const { userValidationRules } = require("../lib/validation/userRules");
const checkLogin = require('../middleware/checkLogin')

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  login
} = require("../controllers/usersController");

router
  .route("/")
  .get(getUsers)
  .post(validateInputs(userValidationRules), addUser);

router
  .route("/:id")
  .get(getUser)
  .delete(checkLogin, deleteUser)
  .put(checkLogin, updateUser);

router.post('/login', login)

module.exports = router;
