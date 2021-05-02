const Record = require("../models/Record");
exports.getRecords = (req, res, next) => {
    const {
        pageNumber,
        recordsPerPage,
        sortOrder,
        sortField,
        search,
        searchField,
    } = req.query;
    Record.find({[searchField]: {$regex: search, $option: 'i'}}, (err, records) => {
        if (err) return console.error(err);
        res.json(records);
    })
        .limit(Number(recordsPerPage))
        .skip(pageNumber * recordsPerPage)
        .sort({ [sortField]: sortOrder });
};

exports.getRecord = (req, res, next) => {
    const { id } = req.params;
    Record.findById(id, (err, entry) => {
        if (err) return res.json({ error: err });
        res.json(entry);
    });
};

exports.deleteRecord = (req, res, next) => {
    const { id } = req.params;
    Record.findByIdAndRemove(id, (err, entry) => {
        if (err) return res.json({ error: err });
        res.json({ deleted: entry });
    });
};

exports.updateRecord = (req, res, next) => {
    const { id } = req.params;
    Record.findByIdAndUpdate(id, req.body, { new: true }, (err, entry) => {
        if (err) return { error: err };
        res.json(entry);
    });
};

exports.addRecord = (req, res, next) => {
    Record.create(req.body, (err, entry) => {
        if (err) return res.json({ error: err });
        res.json(entry);
    });
};
