/*
|--------------------------------------------------------------------------
| Importacion de librerias
|--------------------------------------------------------------------------
|
| https://github.com/jaredhanson/passport-facebook
| http://code.tutsplus.com/articles/social-authentication-for-nodejs-apps-with-passport--cms-21618
| http://thatextramile.be/blog/2012/01/hosting-a-node-js-site-through-apache/
| http://cybmeta.com/introduccion-a-geolocation-api-de-javascript/..0
| https://developers.google.com/maps/documentation/javascript/styling
| http://stackoverflow.com/questions/17636571/jquery-ui-map-change-marker-position
| http://stackoverflow.com/questions/12955783/read-write-xml-node-values-in-nodejs
| http://www.utilities-online.info/xmltojson/#.VbJMepOVtQJ
| http://stackoverflow.com/questions/4829569/help-parsing-iso-8601-date-in-javascript
| http://html2jade.org/
| http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
| http://www.ehowenespanol.com/interpretar-lecturas-barometro-como_32226/
|
*/

var express = require('express');
var passport = require('passport');
var util = require('util')
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var methodOverride = require('method-override');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

var path = require('path');
var fs = require("fs");
var xml2js = require('xml2js');
var mysql = require('mysql');



/*
|--------------------------------------------------------------------------
| Servidor
|--------------------------------------------------------------------------
|
| Especificacion del servidor
|
*/
/*http.listen(3000, function(){
	console.log('listening on *:3000');
});*/

/*
|--------------------------------------------------------------------------
| Ubicaciones de recursos
|--------------------------------------------------------------------------
|
| Especificaciones de las reutas de los recursos.00............................................................................
|
*/
//app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
//app.use('/dist', express.static(__dirname + '/public/dist'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
//app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io'));

/*
|--------------------------------------------------------------------------
| Jade
|--------------------------------------------------------------------------
|
| Engine de vistas
|
*/

app.set("view engine", "jade");

app.set('views', path.join(__dirname, 'views'));

/*
|--------------------------------------------------------------------------
| Facebook
|--------------------------------------------------------------------------
|
| Configuraciones e instancia
|
*/

var FACEBOOK_APP_ID = "< Tu ID de aplicaciones de Facebook>"
var FACEBOOK_APP_SECRET = "< Tu llave secreta de desarrollador de Facebook >";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://sirc.iqbusiness.mx/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'link', 'photos', 'email', 'age_range']
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.use(logger());
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(express.static(__dirname + '/public'));

/*
|--------------------------------------------------------------------------
| Exprss
|--------------------------------------------------------------------------
|
| Rutas
|
*/

app.get('/', function(req, res){
	res.render("index");
});

app.get('/login', function(req, res){
	//res.render('login', { user: req.user });
	res.redirect('/auth/facebook');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/')
}

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
	passport.authenticate('facebook'),
	function(req, res){
		// The request will be redirected to Facebook for authentication, so this
		// function will not be called.
	}
);

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
	//passport.authenticate('facebook', { failureRedirect: '/login', scope: ['user_status', 'user_checkins'] }),
	//console.log("antes del auth");
	passport.authenticate('facebook', { 
		failureRedirect: '/', 
		scope: [
			'user_status', 'user_checkins', 'id', 'displayName', 'link', 'photos', 'email', 'age_range', 'gender', 'locale', 'user_about_me'
		] }),
	//console.log("despues del auth");
	function(req, res) {
		console.log("redireccionando al dash");
		res.redirect('/dashboard');
	}
);

app.get('/logout', 
	function(req, res){
		req.logout();
		res.redirect('/');
	}
);

app.get('/dashboard', ensureAuthenticated, function(req, res){
	//console.log("********************************************************************");
	//console.log("user: ", req.user);
	res.render('dashboard', { user: req.user });
});

app.get('/dashboard/demo1', ensureAuthenticated, function(req, res){
	//console.log("********************************************************************");
	//console.log("user: ", req.user);
	res.render('demo1', { user: req.user });
});

app.get('/dashboard/demo2', ensureAuthenticated, function(req, res){
	//console.log("********************************************************************");
	//console.log("user: ", req.user);
	res.render('demo2', { user: req.user });
});

//------------------------------------------

app.get('/loadroutes', function(req, res) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'sirc',
		password: 'sirc2015+A',
		database: 'sirc',
		port: 3306
	});

	var parser = new xml2js.Parser();

	fs.readFile( './ruta6.gpx', function(err, data) {

		console.log("==========================================");
		console.log(data);

		parser.parseString(data, function (err, result) {
			console.log("-----------------------------------------------------");
			var p = result;

			console.log("error: ", err, " p: ", p);

			for (var i = 0; i < result.gpx.trk[0].trkseg[0].trkpt.length; i++) {
				var p = result.gpx.trk[0].trkseg[0].trkpt[i];
				var point = {};
				point.lat = p.$.lat;
				point.lon = p.$.lon;
				point.ele = p.ele[0];
				point.time_iso = p.time[0];
				var d = new Date(point.time_iso);
				point.time = d.getTime();
				console.log("point: ", point);
				connection.query('INSERT INTO rutas(id_grupo, latitud, longitud, elevacion) VALUES(?, ?, ?, ?)', [6, point.lat, point.lon, point.ele], function(error, result){
					//console.log("query = ", query);
					if(error){
						//throw error;
						console.log('ERROR insertando punto de ruta: ', error);
					}else{
						console.log("Se creo el punto de ruta.");
					}
				});
			}
		});
	});
	res.send("OK");
});

//------------------------------------------

app.post('/cbparams', function(req, res){
	console.log('CONTEXT: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
	console.log("req: ", req.body.contextResponses[0].contextElement.attributes, " id: ", "req: ", req.body.contextResponses[0].contextElement.id);
	res.send(req.query);
});

app.post('/testjc', function(req, res){
	console.log('POST: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	console.log("req: ", req.body);
	res.send(req.query);
});

app.get('/testjc', function(req, res){
	console.log('GET: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	console.log("req: ", req);
	res.send(req.query);
});

var aresult = [];
var bresult = [];

//dispara una animacion en todos los clientes conectados, sobre el recorrido de una ruta de autobuses harcodeada
app.get("/testrt", function(req, res) {
	console.log("TESTAB");
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'sirc',
		password: 'sirc2015+A',
		database: 'sirc',
		port: 3306
	});
	
	connection.query('SELECT * FROM rutas WHERE id_grupo = ?', [1])
		.on('error', function () {
			console.log("Error al buscar las rutas: ");
		})
		.on('result', function (row) {
			aresult.push(row);
			//setTimeout(function() {
			//	console.log("row de la busqueda: ", row);
			//}, 5000);
		})
		.on('fields', function(fields) {
			//console.log("fields: ", fields);
		})
		.on('end', function() {
			io.emit("heatmap", aresult);
			printp(0);
		});

	res.send(req.query);
})

function printp(i) {
	var a = i + 1;
	//console.log("printp: ", i);
	if (a <= aresult.length) {
		var p = aresult[i];
		//console.log("p: ", p);
		io.emit("gpoint", p);
		setTimeout(function(){printp(a);}, 15);
	} else {
		aresult = [];
	}
}

http.listen(3000, function(){
	console.log(';D listening on *:3000');
});

io.on('connection', function(socket){
	console.log("######################################################################3");
	console.log('a user connected');
	socket.on('getruta', function(id_grupo) {
		console.log("Me pidieron una ruta especifica !!!!!");
		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'sirc',
			password: 'sirc2015+A',
			database: 'sirc',
			port: 3306
		});
		
		connection.query('SELECT * FROM rutas WHERE id_grupo = ?', [id_grupo])
			.on('error', function () {
				console.log("Error al buscar las rutas: ");
			})
			.on('result', function (row) {
				bresult.push(row);
			})
			.on('fields', function(fields) {
				//console.log("fields: ", fields);
			})
			.on('end', function() {
				socket.emit('reciberuta', bresult);
				bresult = [];
			});

	});
});

app.get("/loadestados", function(req, res) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'sirc',
		password: 'sirc2015+A',
		database: 'sirc',
		port: 3306
	});

	var estados = [];
	var response = {};
	response.success = true;
	connection.query('SELECT * FROM estados')
		.on('error', function () {
			console.log("Error al buscar los estados");
		})
		.on('result', function (row) {
			estados.push(row);
			//console.log("row de la busqueda: ", row);
		})
		.on('end', function() {
			response.estados = estados;
			res.send(JSON.stringify(response));
		});

});

app.get("/loadciudades", function(req, res) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'sirc',
		password: 'sirc2015+A',
		database: 'sirc',
		port: 3306
	});
	var ciudades = [];
	var response = {};
	response.success = true;
	connection.query('SELECT * FROM municipios WHERE estado_id = ?', [req.query.id_estado])
		.on('error', function () {
			console.log("Error al buscar los municipios");
		})
		.on('result', function (row) {
			ciudades.push(row);
			//console.log("row de la busqueda: ", row);
		})
		.on('end', function() {
			response.ciudades = ciudades;
			res.send(JSON.stringify(response));
		});

});

app.get("/loadrutas", function(req, res) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'sirc',
		password: 'sirc2015+A',
		database: 'sirc',
		port: 3306
	});
	var rutas = [];
	var response = {};
	response.success = true;
	connection.query('SELECT * FROM grupos WHERE id_municipio = ?', [req.query.id_ciudad])
		.on('error', function () {
			console.log("Error al buscar los municipios");
		})
		.on('result', function (row) {
			rutas.push(row);
			//console.log("row de la busqueda: ", row);
		})
		.on('end', function() {
			response.rutas = rutas;
			res.send(JSON.stringify(response));
		});

});