//// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
//var express = require('express');
//var session  = require('express-session');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var port     = process.env.PORT || 3000;
//// 创建项目实例
//var app = express();
//
//
//var passport = require('passport');
//var flash    = require('connect-flash');
//
//
//// configuration ===============================================================
//// connect to our database
//
//require('./config/passport')(passport); // pass passport for configuration
//
//
//
//
//// 加载路由控制
////var routes = require('./routes/index');
////var login = require('./routes/login');
//
//// 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//
//// 定义icon图标
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//// 定义日志和输出级别
//app.use(logger('dev'));
//// 定义数据解析器
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//// 定义cookie解析器
//app.use(cookieParser());
//// 定义静态文件目录
//app.use(express.static(path.join(__dirname, 'public')));
//
//// 匹配路径和路由
////app.use('/', routes);
////app.use('/login', login);
//// app.use('/users', users);
//
//
//
//
//// required for passport
//app.use(session({
//  secret: 'vidyapathaisalwaysrunning',
//  resave: true,
//  saveUninitialized: true
//} )); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session
//
//
//
//
//// 404错误处理
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// 开发环境，500错误处理和错误堆栈跟踪
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// 生产环境，500错误处理
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});
//
//// routes ======================================================================
//require('./routes/routes.js')(app, passport); //
//
//app.listen(port);
//
//// 输出模型app
////module.exports = app;
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
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

// required for passport
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static('public'));


// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

