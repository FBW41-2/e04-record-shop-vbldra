const express = require("express");
const router = express.Router();

const { recordsList, createRecords } = require("../controllers/api");

router.route("/records")
    .get(recordsList)
    .post(createRecords);

module.exports = router;