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
  .delete(checkLogin, checkAdmin, deleteRecord)
  .put(checkLogin, checkAdmin, updateRecord);

module.exports = router;
