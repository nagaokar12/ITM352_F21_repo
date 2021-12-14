/* Function asks server for a "service" and converts the response to text. */
function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            /* Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode */
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
function nav_bar(this_product_key, products) {
    /* Makes a navigation bar to other product pages */
    for (let products_key in products) {
        if (products_key == this_product_key) continue;
        document.write(`<a href='./store.html?products_key=${products_key}'>${products_key}<a>&nbsp&nbsp&nbsp;`);
    }
}