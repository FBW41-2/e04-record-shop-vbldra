const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userValidators = [
    body("email").isEmail().normalizeEmail().withMessage("This is not a valid email"),
    body("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: true,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
        })
        .withMessage("Find better password"),
];

const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addUser,
} = require("../controllers/usersController");

router.route("/").get(getUsers).post(userValidators, addUser);

router.route("/:id").get(getUser).delete(deleteUser).put(updateUser);

module.exports = router;
