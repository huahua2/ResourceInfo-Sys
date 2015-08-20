var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
//var favicon = require('static-favicon');
var app      = express();
var port     = process.env.PORT || 3000;

var passport = require('passport');
var flash    = require('connect-flash');

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating
// 定义icon图标
//app.use(favicon(__dirname + '/public/favicon.ico'));

// required for passport
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);


// 404错误处理
app.use(function(req, res, next) {
  var err = new Error('找不到该页面');
  err.status = 404;
  next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
        title:err.message,
      error: err
    });
  });
}

// 生产环境，500错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
      title:err.message,
    error: {}
  });
});


console.log('The magic happens on port ' + port);

