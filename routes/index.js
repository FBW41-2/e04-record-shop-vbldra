const express = require('express');
const router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./data/db.json')
const db = low(adapter)

router.get('/api/records', (req, res, next) => {
    res.json(db)
})

router.post('/api/records', (req, res, next) => {
    db.push({
        "name": req.body.name,
        "title": req.body.title,
        "year": req.body.year
        })
        .write()
    res.redirect('/api/records')
})

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

module.exports = router;
