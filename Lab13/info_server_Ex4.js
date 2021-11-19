var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + ' query string ' + JSON.stringify(request.query));
    next();
});

/* Product information from product_data and stores it */
var products = require('./product_data.json');

/* To keep track of each quantity sold */
products.forEach((prod, i) => {prod.total_sold = 0});

/* Monitor requests */
app.get("/product_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});

app.post("/process_form", function (request, response, next) {
    let brand = products[0]['brand'];
    let brand_price = products[0]['price'];

    var q = request.body['quantity_textbox'];
    if (typeof q != 'undefined') {
        response.send(`<h2>Thank you for purchasing ${q} ${brand}. Your total is \$${q * brand_price}!</h2>`);
    }
    else {
        response.send(`Invalid quantity. Press the back button and try again.`);
    }
});

app.get('/test', function (request, response, next) {
    response.send('in GET /test');
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function isNonNegInt(q, returnErrors = false) {
    /* Check if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned. Others returns true if q is a non-neg int. */
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    }
    return returnErrors ? errors : (errors.length = 0);
}