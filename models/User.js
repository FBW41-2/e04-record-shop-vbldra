const mongoose = require("mongoose");
const { Schema } = mongoose;
const Address = require("./Address");
const jwt = require("jsonwebtoken");
const superSecretKey = "superSecretKey";
const encryption = require("../lib/validation/encryption");

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            minlength: 1,
        },
        password: {
            type: String,
            required: true,
        },
        address: Address,
        role: {
            type: String,
            enum: ["Admin", "User"],
            required: true,
            default: "User",
        },
        tokens: [
            {
                access: {
                    type: String,
                    required: true,
                },
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        password: {
            type: String,
            required: true,
        },
    },
    {
        toObject: {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    }
);

UserSchema.pre("findOneAndUpdate", async function (next) {
    if (this._update.password) {
        this._update.password = await encryption.encrypt(this._update.password);
    }
    next();
});

UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = "auth";

    const token = jwt
        .sign(
            {
                _id: user._id.toHexString(),
                email: user.email,
                role: user.role,
                access,
            },
            superSecretKey
        )
        .toString();

    user.tokens.push({ access, token });

    return token;
};

UserSchema.methods.getPublicFields = function () {
    var returnObject = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        _id: this._id,
    };

    return returnObject;
};

UserSchema.methods.checkPassword = async function (password) {
    const user = this;
    return await encryption.compare(password, user.password);
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, superSecretKey);
        return decoded;
    } catch (e) {
        return;
    }

    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": "auth",
    }).select("-password -__v");
};

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await encryption.encrypt(this.password);
    next();
});

module.exports = mongoose.model("User", UserSchema);
