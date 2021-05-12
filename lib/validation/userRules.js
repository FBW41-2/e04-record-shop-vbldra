const { body } = require("express-validator");

module.exports = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("This is not a valid email"),
    body("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
        })
        .withMessage("Find better password"),
    body("firstName")
        .exists()
        .trim() // deleting white spaces
        .withMessage("Please provide your first name"),
];
