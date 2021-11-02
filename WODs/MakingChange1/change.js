/* Coin values */
penny = 0.01;
nickel = 0.05;
dime = 0.10;
quarter = 0.25;

/* Change amount */
change = 0.27;

/* Determine which coins to return */
quarter_ret = parseInt(change/quarter);
remainder = change%quarter;
dime_ret = parseInt(remainder/dime);
remainder = change%dime;
nickel_ret = parseInt(remainder/nickel);
penny_ret = Math.round(change%nickel);

/* Print */
console.log(`The amount returned is $${change.toFixed(2)}. That would be ${quarter_ret} quarters, ${dime_ret} dimes, ${nickel_ret} nickels, and ${penny_ret} pennies.`);