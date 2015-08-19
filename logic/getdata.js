
var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);



//获取专家列表
function sel_userlist(successFun){


     execQuery( "select * from expert",[], function(rows){

            successFun(rows)

    }, function(err){        //error
        console.log("专家列表查询失败"+err);
    });
}

//根据id获取专家详情
function sel_expert_byid(id,successFun){

    console.log(id);
    execQuery( "select * from expert where id ="+id,[], function(rows){

        if (rows.length) {
            successFun(rows)
        } else {
            console.log("据id获取专家详情null");
        }
    }, function(err){        //error
        console.log("据id获取专家详情"+err);
    });
}

//根据关键字查询专家
function sel_expert_by_keyword(keyword,successFun){

    console.log(keyword);
    execQuery( "select * from expert where UserName like '%"+keyword+"%' or Post like '%"+keyword+"%'" , [],function(rows){


            successFun(rows)

    }, function(err){        //error
        console.log("根据关键字查询专家"+err);
    });
}

//根据关键字查询专家
function del_expert_by_id(id,successFun){


    execQuery( "delete from expert where id="+id ,[], function(rows){
        successFun(rows)
    }, function(err){        //error
        console.log("根据关键字查询专家"+err);
    });
}


//添加专家
function add_expert(obj,successFun,errerFun){

    //添加
    var sql = "INSERT INTO expert(Category,Sub_Category,Company,UserName,Post,Title,Mobile,Office_Phone,Email,Social_Number,Office_Add,Business_Contacts,Main_Performance,Docking_Contact,Profile,Remarks,HeadUrl) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    //编辑
    if(obj.isEdit!=0)

        sql = "update expert set Category=?,Sub_Category=?,Company=?,UserName=?,Post=?,Title=?,Mobile=?,Office_Phone=?,Email=?,Social_Number=?,Office_Add=?,Business_Contacts=?,Main_Performance=?,Docking_Contact=?,Profile=?,Remarks=?,HeadUrl=? where id="+ obj.isEdit ;

    var pamas=[obj.Category, obj.Sub_Category, obj.Company, obj.UserName, obj.Post, obj.Title, obj.Mobile, obj.Office_Phone, obj.Email, obj.Social_Number, obj.Office_Add, obj.Business_Contacts, obj.Main_Performance, obj.Docking_Contact, obj.Profile, obj.Remarks, obj.HeadUrl];


    execQuery( sql, pamas , function(rows){
        successFun(rows)
    }, function(err){        //error
        errerFun(err);
    });
}




/** 数据库操作 **/
function execQuery( sql, Sql_Params, successFun, errFun ){

    connection.query( sql,Sql_Params,function(err, rows, fields) {
        if (err) throw err;
        if( rows.constructor === Array ) {        //查询操作
                successFun(rows);
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
    sel_userlist: sel_userlist,
    sel_expert_byid: sel_expert_byid,
    sel_expert_by_keyword: sel_expert_by_keyword,
    del_expert_by_id: del_expert_by_id,
    add_expert:add_expert
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
