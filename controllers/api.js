const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);

exports.recordsList = (req, res, next) => {
    res.json(db.get("records").value());
};

exports.createRecords = (req, res, next) => {
    db.get("records")
        .push({
            name: req.body.name,
            title: req.body.title,
            year: req.body.year,
        })
        .write()
    res.redirect("/api/records");
};