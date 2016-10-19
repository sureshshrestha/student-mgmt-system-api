var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var students = require('./routes/students');

var app = express();

var Student = require('./models/Student.js');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/students', students);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://localhost/student-mgmt-system-api')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// File read section
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputFile='students.csv';

var parser = parse({delimiter: ','}, function (err, data) {
  async.forEach(data, function (line, callback) {
    var convertedObjects = JSON.stringify(line);
    var objects = JSON.parse(convertedObjects)

    console.log ("Inserting ... " + objects[0] + '. ' + objects[1]);

    var student = new Student({
      rollno: objects[0],
      name: objects[1],
      class: objects[2]
    })

    student.save(function(err, student) {
      if (err) return console.error(err);
    })
    callback();
  })
})
fs.createReadStream(inputFile).pipe(parser);

module.exports = app;