var path = require('path');
var ObjectId = require('mongodb').ObjectID;

//------------------------------ MODULE HELPERS ------------------------------//

var INDEX_PAGE_PATH, RECRUITING_PAGE_PATH, NOT_FOUND_PATH, ROBOTS_PATH, RESET_PASSWORD_PAGE_PATH;

// Set up robots.txt
ROBOTS_PATH = path.join(__dirname, '..', 'public', 'robots.txt');
// Use minified html for production
if (process.env.TUACM_DEV) {
	// Development
	INDEX_PAGE_PATH = path.join(__dirname, '..', 'public', 'dist', 'index.html');
	RECRUITING_PAGE_PATH = path.join(__dirname, '..', 'public', 'dist', 'recruiting.html');
	NOT_FOUND_PATH = path.join(__dirname, '..', 'public', 'dist', '404.html');
	RESET_PASSWORD_PAGE_PATH = path.join(__dirname, '..', 'public', 'dist', 'reset-password.html');
    ADMIN_PATH=path.join(__dirname, '..', 'public', 'dist', 'admin.html' );
} else {
	// Production
	INDEX_PAGE_PATH = path.join(__dirname, '..', 'public', 'dist', 'index.min.html');
    ADMIN_PATH=path.join(__dirname, '..', 'public', 'dist', 'admin.min.html');
	RECRUITING_PAGE_PATH = path.join(__dirname, '..', 'public', 'dist', 'recruiting.min.html');
	NOT_FOUND_PATH = path.join(__dirname, '..', 'public', 'dist', '404.min.html');
	RESET_PASSWORD_PAGE_PATH = path.join(__dirname, '..', 'public', 'dist', 'reset-password.min.html');
}

//------------------------------- ASSET ROUTES -------------------------------//

exports.route = function(app) {
	//--- PAGES ---//

	// Main page route
	app.get('/', function(req, res) {
		res.sendFile(INDEX_PAGE_PATH);
	});
	// Recruiting slideshow page route
	app.get('/recruiting', function(req, res) {
		res.sendFile(RECRUITING_PAGE_PATH);
	});
	// The 404 page - so stangers may stare in adoration
	app.get('/404', function(req, res) {
		res.sendFile(NOT_FOUND_PATH);
	});
    // Admin testing. NOT FOR ACTUAL PROD USE SINCE THIS NEEDS INTEGRATING
    // TODO: REPLACE WITH ACTUAL PROD USE
    app.get('/admin', function(req, res) {
        if (req.session.passport !== undefined && req.session.passport.user !== undefined) {
            var userId = new ObjectId(req.session.passport.user);
            req.db.collection('users').find({
                _id: userId
            }, {
                officer: 1
            }).toArray(function(err, data) {
                if (err) {
                    res.sendFile(INDEX_PAGE_PATH);
                } else {
                    if (data[0].officer == true) {
                        res.sendFile(ADMIN_PATH);
                    } else {
                        res.sendFile(INDEX_PAGE_PATH);
                    }
                }
            });
        } else {
            res.sendFile(INDEX_PAGE_PATH);
        }
    });
	// Password reset page
	app.get('/settings/password/reset/:token', function(req, res, next) {
		var token = req.param('token');
		if (!token) {
			next();
		} else {
			req.db.collection('users').find({
				passwordResetToken: token
			}).toArray(function(err, users) {
				if (err || !users || users.length < 1) {
					next();
				} else {
					res.sendFile(RESET_PASSWORD_PAGE_PATH);
				}
			});
		}
	});
    app.get('/robots.txt', function(req, res) {
        res.sendFile(ROBOTS_PATH);
    });

	//--- ASSET FETCHING ROUTES ---//

	// Get the slides
	app.get('/slides', function(req, res) {
		req.db.collection('slides').find().sort({
			order: 1
		}).toArray(function(err, results) {
			res.status(200).json(results);
		});
	});
};
