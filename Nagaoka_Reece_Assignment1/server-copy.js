/* Based off server.js from Momoka Michimoto, FALL 2021 */

var products = require('./products.json');

var express = require('express');
var app = express();

/* Initialize QueryString package */
const qs = require('querystring');

const { truncate } = require('fs');

/* Set the initial amount in inventory */
products.forEach((prod, i) => { prod.quantity_available = 10; });

/* Monitor all requests */
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    /* Go on to next one */
    next();
});

/* Took following line of code from Lab13 info_server_Ex3.js */
app.use(express.urlencoded({ extended: true }));

/* Process purchase request (validate quantities, check quantity available) */
/* Taken from Lab13 */
app.post("/process_form", function (request, response, next) {
    var quantities = request.body["quantity"];

    /* Assume no errors and no quantities */
    var errors = [];
    var check_quantities = false;

    /* Confirm that quantities are not negative and integers */
    for (i in quantities) {
        if (isNonNegInt(quantities[i]) == false) {
            errors['quantity_' + i] = `Please choose a valid quantity for ${products[i].model}`;
        }
        if (quantities[i] > 0) {
            check_quantities = true;
        }
        if (quantities[i] > products[i].quantity_available) {
            errors['available_' + i] = `${quantities[i]} is more than what we have of ${products[i].model}.`;
        }
    }
    if (!check_quantities) {
        errors['no_quantities'] = `Please select an item`;
    }
    let q_obj = { "quantity": JSON.stringify(request.body["quantity"]) };
    console.log(Object.keys(errors));

    /* If the quantities pass inspection */
    if (Object.keys(errors).length == 0) {
        products[i].quantity_available -= Number(`quantity${i}`);
        /* Redirect to calculated invoice */
        response.redirect('./public/invoice.html?' + qs.stringify(q_obj));
    }
    /* Otherwise send back to product page */
    else {
        let errors_obj = { "errors": JSON.stringify(errors) };
        console.log(qs.stringify(q_obj));
        response.redirect('./products_display.html?' + qs.stringify(q_obj) + '&' + qs.stringify(errors_obj));
    }
});

/* Routing */
app.get("./product_data.js", function (request, response, next) {
    response.type('.js');
    var product_str = `var products = ${JSON.stringify(products)};`;
    response.send(product_str);
});

/* Modified isNonNegInt function from order_page.html in Lab 12 */
function isNonNegInt(q, returnErrors = false) {
    /* Check if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned. Others returns true if q is a non-neg int. */
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    else if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length = 0);
}

/* Route all other GET request to files in public */
app.use(express.static('./public'));

/* Start server */
app.listen(8080, () => console.log(`listening on port 8080`));

