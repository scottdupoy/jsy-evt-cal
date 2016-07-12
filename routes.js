exports.getHomeRoute = function() {
    return function(req, res) {
        res.render('home');
    };
}

