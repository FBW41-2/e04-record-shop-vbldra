const express = require("express");
const router = express.Router();
const checkLogin = require('../middleware/checkLogin')
const checkAdmin = require('../middleware/checkAdminRole')

const {
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  addRecord
} = require("../controllers/recordsController");

router
  .route("/")
  .get(getRecords)
  .post(checkLogin, checkAdmin, addRecord);

router
  .route("/:id")
  .get(getRecord)
  .delete(deleteRecord)
  .put(updateRecord);

module.exports = router;
