/*
 * Reece Nagaoka
 * 
 * Creates server 
 */

/* Based on server.js from Assignment 1 from Momoka Michimoto, FALL 2021 and modifed since */
/* Also borrowed and modified code from server.js - Krizel Tomines and Margaret Mulhall (FALL 2021) */
/* Borrowed and modified code from Assignment 3 examples as well */
/* Received help from Prof. Port */

/* Set the initial amount in inventory */
var express = require('express');
var app = express();

/* Require cookie-parser (taken from Lab 15 Ex4.js) */
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
app.use(session({ secret: "MySecretKey", resave: true, saveUninitialized: true }));

/* Initialize QueryString package */
const qs = require('querystring');
var fs = require('fs');
const { URLSearchParams } = require('url');

/* Activate to send emails */
var nodemailer = require('nodemailer');

/* Store user information */
var filename = __dirname + '/user_data.json';

/* Require link to product data file */
var products = require(__dirname + '/products.json');

/* If the user file name exists */
if (fs.existsSync(filename)) {
    /* Read filename (from my Lab 14 Ex1b.js) */
    var user_info = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(user_info);
}
/* Otherwise display file does not exist */
else {
    console.log(filename + ' does not exist.');
}

/* Insert isNonNegInt function */
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors
    if (q == '') q = 0  //blank means 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); //check if value is a number
    if (q < 0) errors.push('<font color="red">Negative value</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer</font>'); // Check if it is an integer

    return returnErrors ? errors : (errors.length == 0);
}

/*  Monitor all requests */
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    if (typeof request.session.invoice == 'undefined') { request.session.invoice = {}; }
    /* Continue */
    next();
});

/* ----- From Assignment 3 Code Examples ----- */
app.get("/get_products", function (request, response) {
    response.json(products);
});

/* Routing */
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

/* Route all other GET requests to files in public */
app.use(express.static(__dirname + '/public'));
/* Get body */
app.use(express.urlencoded({ extended: true }));

/* Taken from my Lab 14 Ex4.js and modified */
/* ----- For the login page ----- */
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
            /* Session expires after 30 minutes */
            response.cookie('username', login_username, { maxAge: 30 * 60 * 100 });
            /* Redirect to invoice */
            response.redirect('./store.html?products_key=standard&' + qs.stringify(request.query));
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
/* ----- For the register page ----- */
app.post("/register", function (request, response) {
    var new_errors = {};

    /* Process a simple register form */
    /* Make it so capitalization is irrelevant for usernames */
    var new_username = request.body['username'].toLowerCase();

    /* Require only letters to be used for usernames */
    if (/^[A-Za-z]{4,10}$/.test(request.body.username) == false) {
        new_errors['username'] = 'You must only put letters in your username. '
    }

    /* Require a specific email format */
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email) == false) {
        new_errors['email'] = 'Please enter a valid email address'
    }

    /* Require a unique username */
    if (typeof user_data[new_username] != 'undefined') {
        new_errors['username'] = 'Username is already taken.'
    }

    /* Require a minimum of 4 characters and no more than 10 */
    if (request.body.password.length < 6) {
        new_errors['password'] = 'You must enter a minimum of 6 characters.'
    }

    /* Confirm that both passwords were entered correctly */
    if (request.body.password !== request.body.repeat_password) {
        new_errors['repeat_password'] = 'Both passwords must match'
    }

    let params = new URLSearchParams(request.query);

    /* If new_errors is empty */
    if (JSON.stringify(new_errors) == '{}') {
        /* Write data and send to invoice.html */
        user_data[new_username] = {};
        user_data[new_username].name = request.body.name;
        user_data[new_username].password = request.body.password;
        user_data[new_username].email = request.body.email;

        /* Writes user information into file */
        fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");

        /* Add username and email to query */
        params.append('username', request.body.username);
        params.append('email', user_data[new_username].email);
        response.cookie('username', new_username).send;
        response.redirect('./store.html?products_key=standard&' + params.toString());
        return;
    }
    else {
        /* Put errors and registration data into query */
        params.append('reg_errors', JSON.stringify(new_errors));
        params.append('reg_data', JSON.stringify(request.body));
        response.redirect(`./register.html?` + params.toString());
    }
});

/* Get quantity data from order form and check it */
/* ----- Process form ----- */
/* Change process_form to something like "add_to_cart" */
app.post('/process_form', function (request, response) {
    var quantities = request.body["quantity"];
    var this_product_key = request.body["this_product_key"];

    /* Assume no errors or quantities for now */
    var errors = {};
    var check_quantities = false;

    /* Check quantities are non-negative integers */
    for (i in quantities) {
        /* Check quantity */
        if (isNonNegInt(quantities[i]) == false) {
            errors['quantity_' + i] = `Please choose a valid quantity for ${products[this_product_key][i].model}`;
        }
        /* Check if quantities were selected */
        if (quantities[i] > 0) {
            check_quantities = true;
        }
        /* Check if quantity desired is available */
        if (Number(quantities[i]) > products[this_product_key][i].quantity_available) {
            errors['available_' + i] = `We don't have ${(quantities[i])} ${products[this_product_key][i].model} available.`;
            console.log(quantities[i]);
            console.log(products[this_product_key][i].quantity_available);
        }
    }

    /* Check to see if quantity is selected */
    if (!check_quantities) {
        errors['no_quantities'] = `Please select some items!`;
    }

    let params = new URLSearchParams();
    params.append("products_key", this_product_key);
    params.append("quantities", JSON.stringify(quantities));
    console.log(Object.keys(errors));

    /* Ask if the object is empty or not */
    if (Object.keys(errors).length == 0) {
        /* Add quantities to shopping cart */
        if (typeof request.session.cart == 'undefined') {
            request.session.cart = {};
        }
        request.session.cart[this_product_key] = quantities.map(Number);
        console.log(request.session.cart);
    }

    /* Otherwise go back to store.html */
    else {
        params.append("errors", JSON.stringify(errors));
    }
    response.redirect('./store.html?' + params.toString());
});

/* ----- Get shopping cart ----- */
/* Professor Port provided help for this */
app.get("/get_cart", function (request, response) {
    if (typeof request.session.cart == "undefined") {
        request.session.cart = {};
    }
    response.json(request.session.cart);
});

/* ----- Gets quantity from cart and displays number of items in navbar.js ----- */
/* Taken from Krizel Tomines and Margaret Mulhall's server.js (FALL 2021) */
app.get('/cart_qty', function (request, response) {
    var total = 0;
    for (pkey in request.session.cart) {
        total += request.session.cart[pkey].reduce((a, b) => a + b, 0);
    }
    response.json({ "total": total });
});

/* ----- Update cart after items are added or removed ----- */
/* ----- Used in invoice.html ----- */
/* From Tina Vo (FALL 2021), Assignment 3 server.js */
app.post('/update_cart', function (request, response) {
    
});

/* ----- Process logout ----- */
app.get('/logout', function (request, response) {
    /* Create string */
    str = `<script>alert('You have logged out.'); location.href="./index.html";</script>`;
    /* Clear cookie data associated w/username */
    response.clearCookie('username');
    /* Send the string */
    response.send(str);
    /* End session */
    request.session.destroy();
});

/* ----- Set up mail server and checkout ----- */
/* Based on Assignment 3 code example */
app.get("/checkout", function (request, response) {
    /* Pull username from cookie */
    var username = request.cookies['username'];
    /* Set to no errors */
    var errors = {};

    /* Check if quantities in shopping cart are still available. */
    for (let pk in request.session.cart) {
        let quantities = request.session.cart[pk];
        for (let i in quantities) {
            /* If not, send back to invoice with messge to update */
            if (Number(quantities[i]) > products[pk][i].quantity_available) {
                errors['available_' + pk + '_' + i] = `We don't have ${(quantities[i])} ${products[pk][i].model} available.`;
            }
        }
    }
    /* Remove quantities in cart from available quantities */
    if (Object.keys(errors).length > 0) {
        /* Send back to invoice */
        let params = new URLSearchParams({ "errors": JSON.stringify(errors) });
        response.redirect('./invoice.html?' + params.toString());
        return;
    }
    for (let pk in request.session.cart) {
        let quantities = request.session.cart[pk];
        for (let i in quantities) {
            products[pk][i].quantity_available -= Number(request.session.cart[pk][i]);
        }
    }


    /* Send invoice to email */
    /* Initialize variables */
    var user_email = user_data[username].email;
    console.log(user_email);
    var cart = request.session.cart;

    /* Generate HTML invoice string */
    invoice_str = `
        <link rel="stylesheet" type="text/css" href="stylesheets/invoice-style.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <div class="jumbotron">
            <div class="container text-center">
                <h1>Reece's Diecast Shop</h1>
            </div>
        </div>
        <table style="width:100%">
            <table border="2">
                <tr>
                    <th style="text-align: center;" width="43%">Item</th>
                    <th style="text-align: center;" width="11%">Quantity</th>
                    <th style="text-align: center;" width="13%">Price</th>
                    <th style="text-align: center;" width="54%">Extended price</th>
                </tr>`;
    subtotal = 0;
    for (this_product_key in cart) {
        for (i in cart[this_product_key]) {
            quantities = cart[this_product_key][i];
            if (quantities > 0) {
                extended_price = quantities * products[this_product_key][i].price
                subtotal += extended_price;
                invoice_str = `
                      <tr>
                        <td width="43%">${products[this_product_key][i].model}</td>
                        <td align="center" width="11%">
                          ${quantities}
                        </td>
                        <td width="13%">\$ ${products[this_product_key][i].price}</td>
                        <td width="54%">\$ ${extended_price.toFixed(2)}</td>
                      </tr>`;
            }
        }
    }
    /* Compute tax @ 4.75% */
    var tax_rate = 0.0475;
    var tax = tax_rate * subtotal;

    /* Compute shipping */
    if (subtotal < 30) {
        shipping = 3;
    }
    else if (subtotal < 50) {
        shipping = 4;
    }
    else {
        /* 5% of subtotal */
        shipping = 0.05 * subtotal;
    }

    /* Compute grand total */
    var total = subtotal + tax + shipping;
    invoice_str += `
            </tr>
            <!-- Write out totals -->
            <tr>
            <td colspan="4" width="100%">&nbsp;</td>
            </tr>
            <tr>
            <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
            <td width="54%">$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
            <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Tax @ ${100 * tax_rate}%</span></td>
            <td width="54%">$${tax.toFixed(2)}</td>
            </tr>
            <tr>
            <td style="text-align: center;" colspan="3" width="67%">Shipping</span></td>
            <td width="54%">$${shipping.toFixed(2)}</td>
            </tr>
            <tr>
            <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
            <td width="54%"><strong>$${total.toFixed(2)}</strong></td>
            </tr>
        </table>
    </table>
    <br> 
    <label>OUR SHIPPING POLICY IS: </label><br>
    A subtotal $0 - $29.99 will be $3 shipping. <br>
    A subtotal $30 - $49.99 will be $4 shipping. <br>
    Subtotals over $50 will be charged 5% of the subtotal amount. <br>`;

    /* Set up mail server. */
    var transporter = nodemailer.createTransport({
        host: 'mail.hawaii.edu',
        port: 25,
        secure: false, // use TLS
        tls: {
            /* Do not fail on invalids */
            rejectUnauthorized: false
        }
    });

    /* Email format */
    var mailOptions = {
        from: 'nagaokar@hawaii.edu',
        to: user_email,
        subject: 'Thank you for your purchase',
        html: invoice_str
    };

    /* Send email */
    transporter.sendMail(mailOptions, function (error, info) {
        /* If there's an error message */
        if (error) {
            console.log(error);
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        }
        /* Otherwise send it */
        else {
            invoice_str += `<br>Your invoice was mailed to ${user_email}}. Thank you for shopping with us.`;
        }
        response.send(invoice_str);
    });
    request.session.destroy();
});

/* Start server */
app.listen(8080, () => console.log(`listening on port 8080`));

