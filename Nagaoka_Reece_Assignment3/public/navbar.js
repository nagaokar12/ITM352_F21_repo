/*
 * Reece Nagaoka
 * navbar.js 
*/

/* Taken from built-in navbar in files and modified */
function navbar() {
    document.write(`
    <div class="jumbotron">
    <div class="container text-center">
      <h1>Reece's Diecast Shop</h1>
    </div>
    </div>
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
          <li><a href=""><span class="glyphicon glyphicon-shopping-cart"></span> Cart </a></li>
        </ul>
        </div>
    </div>
    </nav>
    `);
}