const Record = require("../models/Record");

// // O Rewrite it to async-await
// async (req...) => {
//     try {
//         const.... = await Records...
//      if(!records) throw new Error("No records")
//     } catch (err) {
//      next(err)
//  }
// }

// // CONNECTION WITH FRONTEND
exports.getRecords = (req, res, next) => {
    const {
        pageNumber,
        recordsPerPage,
        sortOrder,
        sortField,
        search,
        searchField,
    } = req.query;
    const regex = new RegExp(search);
    Record.find(
        searchField ? { [searchField]: { $regex: regex, $options: "i" } } : {},
        (err, records) => {
            if (err) return console.error(err);
            res.json(records);
        }
    )
        .limit(Number(recordsPerPage))
        .skip(pageNumber * recordsPerPage)
        .sort({ [sortField]: sortOrder });
};

// exports.getRecords = (req, res, next) => {
//     Record.find((err, records) => {
//             if (err) return console.error(err);
//             res.json(records);
//         }
//     )
// };

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
