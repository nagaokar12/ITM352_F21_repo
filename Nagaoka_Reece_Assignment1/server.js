/* Require link to product data file */
var products_array = require('./product_data.json');

var express = require('express');
const { request } = require('http');
var app = express();

/* Routing */
/* Monitor all requests */
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

/* Process purchase request (validate quantities, check quantity available) */


/* Route all other GET request to files in public */
app.use(express.static('./public'));

/* Start server */
app.listen(8080, () => console.log(`listening on port 8080`));
