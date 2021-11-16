/* var userdata = require('./user_data.json'); */
const fs = require('fs');

var filename = 'user_data.json';

if(fs.existsSync(filename)) {
    var user_data_str = fs.readFileSync(filename, 'utf-8');
    var user_data_obj = JSON.parse(user_data_str);
    var file_stats = fs.statSync(filename);

    console.log(`${filename} has ${file_stats.size} characters`);
} else {
    console.log(`Hey! ${filename} does not exist!`);
}

console.log(user_data_obj, typeof user_data_obj);