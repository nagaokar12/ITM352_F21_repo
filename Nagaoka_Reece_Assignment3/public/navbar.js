/*
 * Reece Nagaoka
 * navbar.js 
*/
/* Based on Noah Kim's navbar.js from Assignment 3 (Spring 2021) */

/* Taken from built-in navbar in files and modified */
function navbar() {
  var cart_qty;
  loadJSON('/cart_qty', function (response) {
    cart_qty = JSON.parse(response);
  });
  let params = (new URL(document.location)).searchParams; // get the query string which has the form data
  if (params.has('products_key')) {
    var this_product_key = params.get('products_key');
  }
  document.write(`
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li><a href="index.html">Home</a></li>
          <li>${nav_bar(this_product_key, products)}</li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
        <li><a href="login.html"><span class="glyphicon glyphicon-user"></span> Login </a></li>
        <li><a href="invoice.html"><span class="glyphicon glyphicon-shopping-cart"></span> Cart <sup></sup> </a></li>
        </ul>
        </div>
    </div>
  </nav>
  `);
}