/*
 * Reece Nagaoka
 * navbar.js 
*/
/* Based on Noah Kim's navbar.js from Assignment 3 (Spring 2021) */

/* Set a cookie function */
/* Taken from https://www.w3schools.com/js/js_cookies.asp */
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while(c.charAt(0) == ' ') {
      c = c.substring(1);      
    }
    if(c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/* Taken from built-in navbar in files and modified */
function navbar() {
  let params = (new URL(document.location)).searchParams; // get the query string which has the form data
  let this_product_key = "";
  if (params.has('products_key')) {
    this_product_key = params.get('products_key');
  }
  
  loadJSON('./cart_qty', function(response) {
    console.log(response);
    cart_qty = JSON.parse(response);
    console.log(cart_qty);
  });

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
        <li><a href="store.html?products_key=standard">Road Cars</a></li>
        <li><a href="store.html?products_key=nascar">NASCAR</a></li>
        <li><a href="store.html?products_key=open_wheel">Open Wheel</a></li>
        <li><a href="store.html?products_key=cases">Display Cases</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">`);
      if(getCookie("username") != false) {
        document.write(`
          <li><a href="/logout"><span class="glyphicon glyphicon-user"></span> ${getCookie('username')} (Logout) </a></li>
        `);
      }
      else{
        document.write(`<li><a href="login.html"><span class="glyphicon glyphicon-user"></span> Login </a></li>`);
      }
      // FIX: Quantity is being displayed as a string instead of a number
      document.write(`
      <li><a href="invoice.html"><span class="glyphicon glyphicon-shopping-cart"></span> Cart <sup>(${Number(cart_qty.total)})</sup> </a></li>
      </ul>
      </div>
  </div>
  </nav>
  `);
}