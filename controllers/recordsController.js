const mongodb = require('mongodb')

exports.getRecords = (req, res, next) => {
    req.app.locals.db.collection('records').find().toArray((err, docs) => {
        console.log(docs)

        res.json(docs)
    })
}

exports.getRecord = (req, res, next) => {
    const { id } = req.params;
    req.app.locals.db.collection('records').findOne({_id: new mongodb.ObjectID(id)}, (err, result) => {
        res.json(result)
    })
}

exports.deleteRecord = (req, res, next) => {
    const { id } = req.params;
    req.app.locals.db.collection('records').deleteOne({_id: new mongodb.ObjectID(id)}, (err, result) => {
        if(err) console.error(err)
        console.log("del result", result)
        res.json({deleted: result.deletedCount});
    })
}

exports.updateRecord = (req, res, next) => {
    const { id } = req.params;
    req.app.locals.db.collection('records').updateOne(
        // filter
        {_id: new mongodb.ObjectID(id)}, 
        // new data
        {
            $set: req.body
        },
        // callback function
        (err, entry) => {
            res.json(entry)
        }
    )
}

exports.addRecord = (req, res, next) => {
    const record = req.body;
    // access db from global object
    req.app.locals.db.collection('records').insertOne(record, (err, entry) => {
        res.json(entry)
    })
}