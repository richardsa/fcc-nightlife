'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var SearchHandler = require(path + '/app/controllers/searchHandler.server.js');

module.exports = function(app, passport) {

     function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {

            res.send(JSON.stringify({
                error: "you are not logged in."
            }))
        }
    }

    var clickHandler = new ClickHandler();
    var searchHandler = new SearchHandler();
  app.route('/search')
       .get(searchHandler.request_yelp);
       /*app.route('/search/:bars')
       .get(function(req, res) {
           console.log("index.js " + JSON.stringify(req.params));
            searchHandler.request_yelp;
        });*/



    app.route('/')
        .get(function(req, res) {
            res.sendFile(path + '/public/index.html');
        });
    app.route('/rsvp/:bar')
        .get(searchHandler.rsvp);    
        

    app.route('/login')
        .get(function(req, res) {
            res.sendFile(path + '/public/login.html');
        });

    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/login');
        });

    app.route('/profile')
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + '/public/profile.html');
        });

    app.route('/api/:id')
        .get(isLoggedIn, function(req, res) {
            res.json(req.user.github);
        });

    app.route('/auth/github')
        .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.route('/api/:id/clicks')
        .get(isLoggedIn, clickHandler.getClicks)
        .post(isLoggedIn, clickHandler.addClick)
        .delete(isLoggedIn, clickHandler.resetClicks);
}