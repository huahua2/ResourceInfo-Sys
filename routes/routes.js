
var logicdata = require('../logic/getdata');
module.exports = function(app, passport) {


    //inde页面
	app.get('/', isLoggedIn, function(req, res) {

        logicdata.sel_userlist(function(rows){

                res.render('index.ejs', {
                    title: '智库资源信息系统',
                    user : req.user, // get the user out of session and pass to template
                    datos: rows,
                    keyword: "专家列表"
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
            user : req.user
        }
        );
    });

    //专家详情页面，拦截除数字id外的字符
    app.get(/^\/expert?(?:\/(\d+))/, isLoggedIn, function(req, res) {

        logicdata.sel_expert_byid(req.params[0],function(rows){

            res.render('expert.ejs', {
                title: '专家详情',
                user : req.user, // get the user out of session and pass to template
                expert: rows[0],
                id:req.params[0]
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
