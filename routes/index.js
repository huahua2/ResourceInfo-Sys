var express = require('express');
var mysql = require('mysql');
var router = express.Router();



function BD(){
  var cliente = mysql.createConnection({
    user: 'root',
    password: '123123',
    host: 'localhost',
    port: 3306,
    database: 'toedb'
  });
  return cliente;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'My_Express' });
  var objBD = BD();
  objBD.connect();
  objBD.query("SELECT * FROM com_user", function(error, resultado, fila){
    console.log(resultado);
    res.render('index',  { title: '智库资源信息系统', datos: resultado });
  });

});

module.exports = router;
