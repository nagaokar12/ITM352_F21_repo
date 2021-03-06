/* Based on Noah Kim's (Spring 2021) product_data.js from Assignment 3 */
var products_array =
[
  {
      'type': "standard"
  },
  {
      'type': "nascar"
  },
  {
      'type': 'open_wheel'
  },
  {
      'type': "cases"
  }
]
var standard = 
[
    {
        "model": "Dodge Charger 1:32",
        "image": "./images/DodgeCharger.jpg",
        "price": "30.00",
        "quantity_available": "30"
    },
    {
        "model": "Toyota Supra 1:24",
        "image": "./images/ToyotaSupra.jpg",
        "price": "35.00",
        "quantity_available": "30"
    },
    {
        "model": "Ford F-150 1:24",
        "image": "./images/FordF-150.jpg",
        "price": "40.00",
        "quantity_available": "30"
    },
    {
        "model": "Nissan GTR 1:24",
        "image": "./images/NissanGTR.jpg",
        "price": "25.00",
        "quantity_available": "30"
    },
    {
        "model": "Chevrolet Tahoe 1:36",
        "image": "./images/ChevyTahoe.jpg",
        "price": "20.00",
        "quantity_available": "30"
    }
]
var nascar = 
[
    {
        "model": "Kyle Larson 2021 Chevrolet Camaro 1:24",
        "image": "./images/KyleLarson.jpg",
        "price": "60.00",
        "quantity_available": "30"
    },
    {
        "model": "Kyle Busch 2021 Toyota Supra 1:24",
        "image": "./images/KyleBusch_M&Ms.jpg",
        "price": "50.00",
        "quantity_available": "30"
    },
    {
        "model": "Hailie Deegan 2021 Ford F-150 1:24",
        "image": "./images/HailieDeegan.jpg",
        "price": "45.00",
        "quantity_available": "30"
    }
]
var open_wheel = 
[
    {
        "model": "Lewis Hamilton 2021 Mercedes F1 1:43",
        "image": "./images/LewisHamilton.jpg",
        "price": "100.00",
        "quantity_available": "30"
    },
    {
        "model": "Jimmie Johnson 2021 Honda Indycar 1:18",
        "image": "./images/Johnson_IC.jpg",
        "price": "70.00",
        "quantity_available": "30"
    },
    {
        "model": "Marco Andretti 2020 Honda Indycar 1:18",
        "image": "./images/Andretti.jpg",
        "price": "70.00",
        "quantity_available": "30"
    }
]
var cases = 
[
    {
        "model": "Double 1:24 Case",
        "image": "./images/2-car 1.24 case.jpg",
        "price": "90.00",
        "quantity_available": "30"
    },
    {
        "model": "1:18 Case",
        "image": "./images/118 case.jpg",
        "price": "20.00",
        "quantity_available": "30"
    },
    {
        "model": "5-car 1:64 case",
        "image": "./images/164.jpg",
        "price": "10.00",
        "quantity_available": "30"
    }
]

var allProducts = {
    "Standard": standard,
    "NASCAR": nascar,
    "Open wheel": open_wheel,
    "Cases": cases
}

if(typeof module != 'undefined') {
    module.exports.allProducts = allProducts;
}