const express = require("express");
const router = express.Router();
const auth = require("../middleware/authenticator");
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
  .post(auth, checkAdmin, addRecord);

router
  .route("/:id")
  .get(getRecord)
  .delete(auth, checkAdmin, deleteRecord)
  .put(auth, checkAdmin, updateRecord);

module.exports = router;
