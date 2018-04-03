var express = require('express');
var router = express.Router();
// require mongoose
var mongoose = require('mongoose');
// make connection 
mongoose.connect('localhost:27017/test'); // path to database 
// create schema 
var Schema = mongoose.Schema;

// create layout (blueprint)
var userDataSchema = new Schema({
  title: {type: String, required: true}, // required = validation
  content: String,
  author: String
}, {collection: 'user-data'}); // add collection 

// create model of the blueprint
var UserData = mongoose.model('UserData', userDataSchema); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET data */
router.get('/get-data', function(req, res, next) {
  UserData.find() // find all entries 
      // handle results
      .then(function(doc) {  
        // return results to index page
        res.render('index', {items: doc});
      });
});

/* POST add data */
router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  // create instance of model 
  var data = new UserData(item); // pass data in constructor 
  data.save(); // store data to database 

  res.redirect('/');
});

/* POST update data */
router.post('/update', function(req, res, next) {
  var id = req.body.id;

  // use model to pass in id 
  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    // update data 
    doc.title = req.body.title;
    doc.content = req.body.content;
    doc.author = req.body.author;
    doc.save();
  })
  res.redirect('/');
});

/* POST delete elements */
router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;