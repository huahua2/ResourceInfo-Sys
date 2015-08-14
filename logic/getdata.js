
var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);



//获取专家列表
function sel_userlist(successFun){


     execQuery( "select * from users", function(rows){

        if (rows.length) {
            successFun(rows)
                  } else {
            console.log("专家列表查询失败");
        }
    }, function(err){        //error
        console.log("专家列表查询失败"+err);
    });
}



/** 数据库操作 **/
function execQuery( sql, successFun, errFun ){
    connection.query( sql, function(err, rows, fields) {
        if (err) throw err;
        if( rows.constructor === Array ) {        //查询操作
            if( !!rows.length ) {
                successFun(rows);
            } else {
                errFun(err);
            }
        } else {        //增删改 操作
            if( rows.affectedRows === 1 ) {
                successFun(rows);
            } else {
                errFun(err);
            }
        }
    });
}

var exports = {
    sel_userlist: sel_userlist
    //execQuery: execQuery
};

module.exports = exports;


//var router = express.Router();
//
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  //res.render('index', { title: 'My_Express' });
//
//  var sql = "SELECT * FROM com_user";
//  if( !!conn && !!conn._socket.readable ) {        //表示数据库连接对象没有被中断，可以继续使用
//    conn = conn;
//    console.log('==========');
//  } else {        //否则，需要重新连接
//    conn = db.getConnection( db.client, db.settings  );
//    db.connectDB( conn );
//    console.log('+++++++');
//  }
//
//  db.execQuery( sql, conn, function(rows){        //success
//    console.log(rows);
//    res.render('index',  { title: '智库资源信息系统', datos: rows });
//  }, function(err){        //error
//    console.log("专家列表查询失败"+err);
//  });
//
//
//});
//
//module.exports = router;
