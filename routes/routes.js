
var logicdata = require('../logic/getdata');
var formidable = require('formidable'),
    querystring = require("querystring"),
    fs = require('fs');
module.exports = function(app, passport) {


    //inde页面
	app.get('/', isLoggedIn, function(req, res) {

        logicdata.sel_userlist(function(rows){

                res.render('index.ejs', {
                    title: '智库资源信息系统',
                    user : req.user, // get the user out of session and pass to template
                    datos: rows,
                    keyword: rows.length > 0 ? "专家列表" : "暂无数据"
                });
        });

	});
    //查询专家
    app.get('/search/:keyword', isLoggedIn, function(req, res) {

        logicdata.sel_expert_by_keyword(req.params.keyword,function(rows){

            res.render('index.ejs', {
                title: '智库资源信息系统',
                user : req.user, // get the user out of session and pass to template
                datos: rows,
                keyword:"查到关键字 :" +"“"+ req.params.keyword +"”" +rows.length +" 条记录"
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

		res.render('login.ejs', { title: '登录-智库资源信息系统',message: req.flash('loginMessage') });
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
        //console.log( req.body.UserName);
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
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
