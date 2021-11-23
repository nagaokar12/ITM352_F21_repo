var fs = require('fs');
var express = require('express');
var app = express();

var filename = './user_data.json';

if (fs.existsSync(filename)) {
    /* Have regular data file, so read data and parse into user_registration_info object */
    let data_str = fs.readFileSync(filename, 'utf-8');
    var user_registration_info = JSON.parse(data_str);
    var stats = fs.statSync(filename);
    console.log(user_registration_info);
    console.log(filename + ' has ' + stats["size"] + ' characters');
} else {
    console.log(filename + 'does not exist!');
}

app.get("/", function (request, response) {
    response.send('Nothing here');
});

app.use(express.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form
    username = request.body.username;
    if (typeof user_registration_info[username] == 'undefined' && (request.body['password'] == request.body['repeat_password'])) {
        user_registration_info[username] = {};
        user_registration_info[username].password = request.body.password;
        user_registration_info[username].email = request.body.email;


        fs.writeFileSync(filename, JSON.stringify(user_registration_info));
        response.redirect('./login');
        console.log("Registered!");
    }
    else {
        response.redirect('./register');
        console.log("Not registered.");
    }
});

app.post("/login", function (request, response) {
    /* Process login form POST and redirect to logged in page if ok, back to login page if not */
    let login_username = request.body['username'];
    let login_password = request.body['password'];

    /* Check if username exists, then check password entered matches stored password */
    if (typeof user_registration_info[login_username] != 'undefined') {
        if (typeof user_registration_info[login_username]["password"] == login_password) {
            response.send(`${login_username} is logged in`);
        }
        else {
            response.redirect('./login');
        }
    }
    else {
        response.send(`${login_username} does not exist`);
    }
    response.send('processing login', JSON.stringify(request.body));
});

app.listen(8080, () => console.log(`Listening on port 8080`));