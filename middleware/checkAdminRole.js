module.exports = (req, res, next) => {
    if (req.user.role == "Admin") {
        next();
    } else {
        next({ message: "You don't have admin rights" });
    }
};
