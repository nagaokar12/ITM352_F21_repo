/*
 * Reece Nagaoka
 * navbar.js 
*/
/* Based on Noah Kim's navbar.js from Assignment 3 (Spring 2021) */

function nav_bar(this_product_key, products) {
  /* Makes a navigation bar to other product pages */
  for (let products_key in products) {
      if (products_key == this_product_key) continue;
      document.write(`<a href='./store.html?products_key=${products_key}'>${products_key}<a>&nbsp&nbsp&nbsp;`);
  }
}

/* Taken from built-in navbar in files and modified */
function navbar() {
  let params = (new URL(document.location)).searchParams; // get the query string which has the form data
  let this_product_key = "";
  if (params.has('products_key')) {
    this_product_key = params.get('products_key');
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
          <li><a href="${nav_bar(this_product_key, products)}"></a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
        <li><a href="login.html"><span class="glyphicon glyphicon-user"></span> Login </a></li>
        <li><a href="invoice.html"><span class="glyphicon glyphicon-shopping-cart"></span> Cart <sup>()</sup> </a></li>
        </ul>
        </div>
    </div>
  </nav>
  `);
}