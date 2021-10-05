require("./product_data.js");
var num_products = 5;
var count = 1;
/* While count is less than equal to num_products (count up to value of num_products) */
while(count <= (num_products/2)) { 
    console.log(`${count}. ${eval('name' + count)}`);
    /* Increment count */
    count++;
}
console.log("That's all we have!");