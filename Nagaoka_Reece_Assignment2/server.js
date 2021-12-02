/*
 * Reece Nagaoka
 * 
 * Creates server 
 */

/* Based on server.js from Assignment 1 from Momoka Michimoto, FALL 2021 and modifed since */
/* Also received help from Prof. Port */

/* Require link to product data file */
var products = require(__dirname + '/products.json');

/* Set the initial amount in inventory */
products.forEach((prod, i) => { prod.quantity_available = 30; });
var express = require('express');
var app = express();

/* Initialize QueryString package */
const qs = require('querystring');
var fs = require('fs');
const { URLSearchParams } = require('url');

/* Store user information */
var filename = __dirname + '/user_data.json';

if (fs.existsSync(filename)) {
    /* Read filename (from my Lab 14 Ex1b.js) */
    var user_info = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(user_info);
}
else {
    console.log(filename + ' does not exist.');
}

/*  Monitor all requests */
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);

    /* Continue */
    next();
});

/* Get body */
app.use(express.urlencoded({ extended: true }));

/* Taken from my Lab 14 Ex4.js and modified */
/* --- For the login page --- */
app.post("/process_login", function (request, response) {
    var error;

    /* Process login form POST and redirect to logged in page if ok, back to login page if not */
    /* Make it so capitalization is irrelevant for usernames */
    let login_username = request.body['username'].toLowerCase();
    let login_password = request.body['password'];

    /* Check if username exists */
    if (typeof user_data[login_username] != 'undefined') {
        /* Then checks password entered matches stored password */
        if (user_data[login_username].password == login_password) {
            /* Redirects to the invoice page and displays items purchased */
            request.query['username'] = login_username;
            request.query['email'] = user_data[login_username].email;
            response.redirect('./invoice.html?' + qs.stringify(request.query));
            return;
        }
        else {
            /* If password is incorrect */
            error = 'Incorrect password';
        }
    }
    else {
        /* If username has not been created */
        error = `${login_username} does not exist`;
    }

    /* If there are errors, send back to login page with errors */
    request.query['username'] = login_username;
    request.query['error'] = error;
    response.redirect(`./login.html?` + qs.stringify(request.query));
});

/* Also taken from my Lab 14 Ex.4.js and modified */
/* --- For the register page --- */
app.post("/register", function (request, response) {
    var new_errors = {};

    /* process a simple register form */
    /* Make it so capitalization is irrelevant for usernames */
    var new_username = request.body['username'].toLowerCase();

    /* Require only letters to be used for usernames */
    if (/^[A-Za-z]{4,10}$/.test(request.body.username) == false) {
       new_errors['username'] = 'You must only put letters in your username. '
    }

    /* Require a specific email format */
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email) == false) {
        new_errors['email'] = 'Please enter a valid email address'
    }

    /* Require a unique username */
    if (typeof user_data[new_username] != 'undefined') {
        new_errors['username'] = 'Username is already taken.'
    }

    /* Require a minimum of 4 characters and no more than 10 */
    if(request.body.password.length < 6) {
        new_errors['password'] = 'You must enter a minimum of 6 characters.'
    }

    /* Confirm that both passwords were entered correctly */
    if(request.body.password !== request.body.repeat_password) {
        new_errors['repeat_password'] = 'Both passwords must match'
    }

    /* If new_errors is empty */
    if (JSON.stringify(new_errors) == '{}') {
        /* Write data and send to invoice.html */
        user_data[new_username] = {};
        user_data[new_username].password = request.body.password;
        user_data[new_username].email = request.body.email;
        fs.writeFileSync(filename, JSON.stringify(user_data));

        /* Add username and email to query */
        request.query['username'] = new_username;
        request.query['email'] = user_data[new_username].email;
        response.redirect('./invoice.html?' + qs.stringify(request.query));
        return;
    }
    else {
        /* Put errors and registration data into query */
        request.query['reg_errors'] = JSON.stringify(new_errors);
        request.query['reg_data'] = JSON.stringify(request.body);
        response.redirect(`./register.html?` + qs.stringify(request.query));
    }
});

/* Get quantity data from order form and check it */
/* ----- Process form ----- */
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

    /* Check to see if quantity is selected */
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
        response.redirect('./login.html?' + qs.stringify(qty_obj));
    }

    /* Otherwise go back to store.html */
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
app.use(express.static(__dirname + '/public'));

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