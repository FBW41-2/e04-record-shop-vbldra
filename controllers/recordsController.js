const Record = require("../models/Record");

// // CONNECTION WITH FRONTEND
exports.getRecords = async (req, res, next) => {
    try {
        const {
            pageNumber,
            recordsPerPage,
            sortOrder,
            sortField,
            search,
            searchField,
        } = req.query;
        const regex = new RegExp(search);
        const records = await Record.find(
            searchField
                ? { [searchField]: { $regex: regex, $options: "i" } }
                : {}
        )
            .limit(Number(recordsPerPage))
            .skip(pageNumber * recordsPerPage)
            .sort({ [sortField]: sortOrder });
        if (!records) throw new Error("Records not found");
        res.json(records);
    } catch (error) {
        next(error);
    }
};

exports.getRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await Record.findById(id)
        if (!record) throw new Error("Record not found");
        res.json(record);
    } catch (error) {
        next(error);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await Record.findByIdAndRemove(id)
        if (!record) throw new Error("Cannot delete. Record not found");
        res.json(record);
    } catch (error) {
        next(error);
    }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await Record.findByIdAndUpdate(id, req.body, { new: true })
        if (!record) throw new Error("Cannot update. Record not found");
        res.json(record);
    } catch (error) {
        next(error);
    }    
};

exports.addRecord = async (req, res, next) => {
    try {
        const entry = req.body
        const record = await Record.create(entry)
        if (!record) throw new Error("Cannot add new record");
        res.json(record);
    } catch (error) {
        next(error);
    }    
};
