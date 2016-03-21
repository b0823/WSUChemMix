var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var db = require('../db.js')

router.use(cookieParser());
router.use(expressSession({secret:'546dxfgcdsy54'}));

function restrict(req, res, next) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  if (req.session.user) {
    next();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    req.session.error = 'Access denied!';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
}

function adminRestrict(req, res, next) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  if (req.session.user) {
    if(req.session.user.isAdmin){
      next();                     
    } else {
      res.redirect('/ClassList')
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    req.session.error = 'Access denied!';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
}

function authenticate(name, pass, fn) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  // if (!module.parent) 
    var collection = db.users;

    collection.find({"username":name}).toArray(function(err,docs){
        if(err){
            return fn(new Error('User Not Found'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        }
        if(docs == undefined || docs.length == 0 || docs.length > 1){
          return fn(new Error('User Not Found'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        } else {
            if (pass == docs[0].password) return fn(null, docs[0]);
            fn(new Error('invalid password'));  
        }
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
}  


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChemicalMix' });
});

router.get('/StudentJoin', function(req, res, next) {
    res.render('StudentJoin', { title: 'ChemicalMix' });
});

router.get('/ClassList', restrict, function(req, res, next) {

  var collection = db.classes;

  collection.find({"instructorID":req.session.user.username}).toArray(function(err,docs){
    if(docs == undefined){ docs = [];}
    res.render('ClassList', { title: 'Instructor Panel', classList:docs });
  }); 

});

router.get('/CreateClass', restrict, function(req, res, next) {
    res.render('CreateClass', { title: 'Create Class'});
});

router.get('/Admin', adminRestrict, function(req, res, next) {
  var collection = db.users;

  collection.find({"isAdmin":false}).toArray(function(err,docs){
      res.render('Admin', { title: 'Admin Panel', instructorList: docs});
  }); 
});

router.post('/AddInstructor', adminRestrict ,function(req, res){
   var collection = db.users;
   collection.find({username:req.body.username}).toArray(function(err,docs){
      if(docs.length == 0 || docs == undefined){ //check if name isn't in use
        collection.insert({ "username" : req.body.username,"password" : req.body.password,"isAdmin" : false},function(e,docs){ 
          res.redirect("/Admin")
        });
      } else {
         res.redirect("/Admin")
      }
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
}); 

router.post('/DeleteInstructor', adminRestrict ,function(req, res){
   var collection = db.users;
   collection.remove({username:req.body.username},function(e,docs){ 
      var collection = db.classes;
        collection.remove({instructorID:req.body.username},function(e,docs){
          res.redirect("/Admin")
        });
   });

}); 

router.get('/Login', function(req, res, next) {
  res.render('Login', { title: 'ChemicalMix' });
});

router.post('/Login', function(req, res){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  authenticate(req.body.username, req.body.password, function(err, user){                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    if (user) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      // Regenerate session when signing in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
      // to prevent fixation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      req.session.regenerate(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        // Store the user's primary key                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        // in the session store to be retrieved,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        // or in this case the entire user object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        req.session.user = user;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        res.redirect('/ClassList');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
      res.redirect('/login'); 
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
}); 

router.get('/logout', function(req, res){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  // destroy the user's session to log them out                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  // will be re-created next request                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  req.session.destroy(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
     
router.get('/:classID/:studentID', function(req, res) {
    var collection = db.classes;//('classes');

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


router.get('*', function(req, res) {
  res.redirect('/');
});

module.exports = router;
