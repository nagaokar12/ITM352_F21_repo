/* Based on server.js from Momoka Michimoto, FALL 2021 */

/* Require link to product data file */
var products = require('./products.json');

/* Set the initial amount in inventory */
products.forEach((prod, i) => { prod.quantity_available = 10; });
var express = require('express');
var app = express();

/* Initialize QueryString package */
const qs = require('querystring');
const { truncate } = require('fs');

/*  monitor all requests */
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next(); //keep going
});

/* Get body */
app.use(express.urlencoded({ extended: true }));

/* Get quantity data from order form and check it */
app.post('/process_form', function (request, response) {
    var quantities = request.body["quantity"];
    /* Assume no errors or quantities for now */
    var errors = {};
    var check_quantities = false;
    /* Check quantities are non-negative integers */
    for (i in quantities) {
        /* Check quantity */
        if (isNonNegInt(quantities[i]) == false) {
            errors['quantity_' + i] = `Please choose a valid quantity for ${products[i].model}`;
        }
        /* Check if quantities were selected */
        if (quantities[i] > 0) {
            check_quantities = true;
        }
        /* Check if quantity desired is available */
        if (quantities[i] > products[i].quantity_available) {
            errors['available_' + i] = `We don't have ${(quantities[i])} ${products[i].model} available.`;
        }
    }
    // Check if quantity is selected
    if (!check_quantities) {
        errors['no_quantities'] = `Please select some items!`;
    }

    let qty_obj = { "quantity": JSON.stringify(request.body["quantity"]) };
    console.log(Object.keys(errors));
    /* Ask if the object is empty or not */
    if (Object.keys(errors).length == 0) {
        for (i in quantities) {
            products[i].quantity_available -= Number(quantities[i]);
        }
        response.redirect('./invoice.html?' + qs.stringify(qty_obj));
    }
    /* Otherwise go back to products_display.html */
    else {
        let errs_obj = { "errors": JSON.stringify(errors) };
        console.log(qs.stringify(qty_obj));
        response.redirect('./store.html?' + qs.stringify(qty_obj) + '&' + qs.stringify(errs_obj));
    }

});


/* Routing */
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

/* Route all other GET requests to files in public */
app.use(express.static('./public'));

/* Start server */
app.listen(8080, () => console.log(`listening on port 8080`));


/* Insert isNonNegInt function */
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors
    if (q == '') q = 0  //blank means 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); //check if value is a number
    if (q < 0) errors.push('<font color="red">Negative value</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer</font>'); // Check if it is an integer

    return returnErrors ? errors : (errors.length == 0);
}