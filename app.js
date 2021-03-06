var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

const { updateDB } = require('./logic/updateDB.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// consts for development
const testing = false; // database will not be updated!!

// interval at which to update db
const updateDbInterval = 1000 * 60 * 60 * 24; // this is a day: 1000 * 60 * 60 * 24;

// set up mongoose connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/discounts');
var db = mongoose.connection;
db.on('error', () => { console.log('There was an error connecting to the database.')});
db.once('open', () => {
  console.log('Database discounts successfully connected.');
  if (!(testing)) {
   db.dropCollection('products');
  }
  console.log('Collection "products" dropped.')
});

// update database when application starts
if (!(testing)) {
  updateDB();
}

// update the database every day
setInterval(() => {
  if(!(testing)) {
    updateDB();
  }
}, updateDbInterval);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
