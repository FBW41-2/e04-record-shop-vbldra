const express = require('express');
const router = express.Router();

const records = [
    {
        "name": "Metallica",
        "title": "Unforgiven",
        "year": "1998"
    },
    {
        "name": "Beatles",
        "title": "Let it be",
        "year": "1975"
    },
    {
        "name": "System of a Down",
        "title": "Chop Suey",
        "year": "2002"
    }
]

router.get('/api/records', (req, res, next) => {
    res.json(records)
})
router.post('/api/records', (req, res, next) => {
    records.push({
        "name": req.body.name,
        "title": req.body.title,
        "year": req.body.year
    })
    res.redirect('/api/records')
})

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

module.exports = router;
