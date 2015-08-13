var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
  res.render('login', { title: '登录-智库资源信息系统' });
});

module.exports = router;
