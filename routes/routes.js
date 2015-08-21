
var logicdata = require('../logic/getdata');
var formidable = require('formidable'),
    querystring = require("querystring"),
    fs = require('fs');
module.exports = function(app, passport) {


    var page={
        limit:10,
        num:1
    };
    //var search={};
    //inde页面
	app.get('/', isLoggedIn, function(req, res) {

        //查看哪页
        if(req.query.p){
            page['num']=(req.query.p<1) ||  (req.query.p==undefined) ? 1 : req.query.p;
        }
        var model = {
            //search:search,
            //columns:'name alias director publish images.coverSmall create_date type deploy',
            page:page
        };
        logicdata.sel_userlist(model,function(rows,totalCount){

            var total=totalCount;
            var pageCount=Math.ceil(total / page.limit);
            page['pageCount']= pageCount;
            page['size']=total;
            page['numberOf']=pageCount>5?5:pageCount;

                res.render('index.ejs', {
                    title: '蓝海智库系统',
                    user : req.user, // get the user out of session and pass to template
                    datos: rows,
                    keyword: rows.length > 0 ? "信息列表" : "暂无数据",
                    page:page
                });
        });

	});
    //查询专家
    app.get('/search/:keyword', isLoggedIn, function(req, res) {

        logicdata.sel_expert_by_keyword(req.params.keyword,function(rows){

            res.render('index.ejs', {
                title: '蓝海智库系统',
                user : req.user, // get the user out of session and pass to template
                datos: rows,
                keyword:"查到关键字 :" +"“"+ req.params.keyword +"”" +rows.length +" 条记录",
                page :null
            });
        });

    });
    //删除专家
    app.get('/del/:id', isLoggedIn, function(req, res) {

        logicdata.del_expert_by_id(req.params.id,function(rows){


            //console.log(rows.affectedRows)
            if(rows.affectedRows===1)
            res.redirect('/');

        });

    });

	// =====================================
	// LOGIN页面 ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		res.render('login.ejs', { title: '登录-蓝海智库系统',message: req.flash('loginMessage') });
		// render the page and pass in any flash data if it exists
		//res.render('login.ejs', {  });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

    //添加专家
    app.get('/add_expert', isLoggedIn, function(req, res) {
        res.render('add_expert.ejs',
        {
            title:"添加专家",
            user : req.user,
            //message: req.flash('add_msg'),
            expert: null,
            isEdit:0

        }
        );
    });
    //添加专家
    app.post('/add_expert', function(req, res) {

        //console.log( );
        console.log( req.body);
        // 设置接收数据编码格式为 UTF-8
        req.setEncoding('utf-8');

        var returnInfo = [{
            "error": 1,
            "msg": "保存失败，请重试"
        }];
        logicdata.add_expert(req.body,function(rows){

            if(rows.affectedRows===1){

                returnInfo[0].error= 0, returnInfo[0].msg="保存成功！";
            }
            res.send(returnInfo);
        },function(err){
            returnInfo[0].msg="保存失败，请重试！"+err;
            res.send(returnInfo);
        });
    });


    //专家详情页面，拦截除数字id外的字符
    app.get(/^\/expert?(?:\/(\d+))/, isLoggedIn, function(req, res) {

        logicdata.sel_expert_byid(req.params[0],function(rows){

            res.render('expert.ejs', {
                title: '专家详情',
                user : req.user,
                expert: rows[0],
                id:req.params[0]
            });
        });
    });

    //上传头像
    app.post('/uploadImg', function(req, res, next) {
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
      //  form.uploadDir = __dirname + '/../public/images';
        form.uploadDir = "./public/images/";//改变临时目录
        form.parse(req, function(error, fields, files){
            if (error) {
                var info = [{
                    "error": 1,
                    "url": ""
                }];
                res.send(info);
                return;
            }
            for(var key in files){
                var file = files[key];
                var fName = (new Date()).getTime();
                switch (file.type){
                    case "image/jpeg":
                        fName = fName + ".jpg";
                        break;
                    case "image/png":
                        fName = fName + ".png";
                        break;
                    default :
                        fName =fName + ".png";
                        break;
                }
                console.log(file.path);
                var uploadDir = "./public/images/" + fName;
                fs.renameSync(file.path, uploadDir);  //重命名

                var info = [{
                    "error": 0,
                    "url": fName
                }];
                res.send(info);


            }
        });

    });

    //编辑专家
    app.get(/^\/edit?(?:\/(\d+))/, isLoggedIn, function(req, res) {

        logicdata.sel_expert_byid(req.params[0],function(rows){

            res.render('add_expert.ejs', {
                title: '编辑专家',
                user : req.user,
                expert: rows[0],
                id:req.params[0],
                isEdit: req.params[0]
            });
        });
    });

    //导入功能
    app.post('/excel',function(req,res){

        var obj={
                isEdit : 0,
                Category:"",
                Sub_Category:"",
                Company:"",
                UserName:"",
                Post:"",
                Title:"",
                Mobile:"",
                Office_Phone:"",
                Email:"",
                Social_Number:"",
                Office_Add:"",
                Business_Contacts:"",
                Main_Performance:"",
                Docking_Contact:"",
                Profile:"",
                Remarks:"",
                HeadUrl:""
        }


        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        //  form.uploadDir = __dirname + '/../public/images';
        form.uploadDir = "./public/excel/";//改变临时目录

        form.parse(req, function(error, fields, files) {

            var info = [{
                "success": 0,
                "error": 0,
            }];
            for (var key in files) {
                var file = files[key];

                var xlsx = require("node-xlsx");
                //读取excel
                var list = xlsx.parse(file.path);
                //第一个工作表的数据
                var data = list[0].data;

                //console.log(data.length);
                for(var i=2;i<=data.length-2;i++){


                    //for(var k=1;k<=16;k++){
                    //
                    //    if(data[i][k]==undefined)
                    //    data[i][k]="";
                    //}
                   // console.log(data[i]);
                    if(data[i].length>1) {
                        info[0].success=info[0].success+1;
                        obj.Category = data[i][1];
                        obj.Sub_Category = data[i][2];
                        obj.Company = data[i][3];
                        obj.UserName = data[i][4];
                        obj.Post = data[i][5];
                        obj.Title = data[i][6];
                        obj.Mobile = data[i][7];
                        obj.Office_Phone = data[i][8];
                        obj.Email = data[i][9];
                        obj.Social_Number = data[i][10];
                        obj.Office_Add = data[i][11];
                        obj.Business_Contacts = data[i][12];
                        obj.Main_Performance = data[i][13];
                        obj.Docking_Contact = data[i][14];
                        obj.Profile = data[i][15];
                        obj.Remarks = data[i][16];
                    }else{
                        continue;
                    }

                    logicdata.add_expert(obj,function(rows){
                        //if(rows.affectedRows===1){
                        //
                        //}

                        //res.send(returnInfo);
                    },function(err){
                        info[0].error=1;
                        res.send(info);
                        //  continue;
                    });
                }
            }
            res.send(info);
        })


    })
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
