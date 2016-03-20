var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChemicalMix' });
});

router.get('/StudentJoin', function(req, res, next) {
  res.render('StudentJoin', { title: 'ChemicalMix' });
});

router.get('*', function(req, res) {
  res.redirect('/');
});

router.get('/:classID/:studentID', function(req, res) {
    var db = req.db;
    var collection = db.get('classes');

    collection.find({"classID":req.params.classID},{},function(e,docs){ 
        if(docs.length == 0){
            //Not found in DB.
            res.redirect('/StudentJoin');
        } else {
            res.render('Experiment', {
                "title": 'Class ' + req.params.classID,
                "budget": 25
            });
        }
    });
});

module.exports = router;
