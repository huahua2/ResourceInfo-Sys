//var express = require('express');
//var client = require('mysql');
////var app = express();
//
///** 数据库配置 **/
//var settings = {
//    host: 'localhost',
//    user: 'root',
//    password: '123123',        //写你自己的密码
//    database:'toedb',
//    port: 3306
//};
//
///** 取得数据库连接对象 **/
//function getConnection( client, settings ){
//    return client.createConnection( settings );
//}
//
///** 连接数据库 **/
//function connectFun( conn ){
//    conn.connect(function(error, results) {
//        if(error) {
//            console.log('Connection Error: ' + error.message);
//            return;
//        }
//        console.log('Connected to MySQL');
//    });
//}
//
///** 数据库操作 **/
//function execQuery( sql, conn, successFun, errFun ){
//    conn.query( sql, function(err, rows, fields) {
//        if (err) throw err;
//        if( rows.constructor === Array ) {        //查询操作
//            if( !!rows.length ) {
//                successFun(rows);
//            } else {
//                errFun(err);
//            }
//        } else {        //增删改 操作
//            if( rows.affectedRows === 1 ) {
//                successFun(rows);
//            } else {
//                errFun(err);
//            }
//        }
//    });
//}
//
//var exports = {
//    client: client,
//    settings: settings,
//    getConnection: getConnection,
//    connectDB: connectFun,
//    execQuery: execQuery
//};
//
//module.exports = exports;
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': '123123'
    },
    'database': 'ResourceInfo_Sys',
    'users_table': 'users'
};
