const shop_routes = require('./shop_router')


function routes(app) {
    app.use('/', shop_routes)
}



module.exports = routes