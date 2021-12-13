/*
 * Reece Nagaoka
 * navbar.js 
*/

function loadJSON(service, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('POST', service, false);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

/* Taken from built-in navbar in files and modified */
function navbar() {
  var cart_qty;
  loadJSON('/cart_qty', function (response) {
    cart_qty = JSON.parse(response);
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
          <li><a href="store.html">Products</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
        <li><a href="login.html"><span class="glyphicon glyphicon-user"></span> Login</a></li>
        <li><a href="invoice.html"><span class="glyphicon glyphicon-shopping-cart"></span> Cart<sup></sup> </a></li>
        </ul>
        </div>
    </div>
  </nav>
  `);

}