const { crunchData } = require('../logic/crunchData.js');

var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

  // displays jewelry by default
  crunchData(3891, 0, [], undefined, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));
  
});

/* GET category page. */
router.get('/category/:category', function(req, res, next) {

  let catNum = "NaN";
  switch (req.params.category) {
    case "appliances":
        catNum = "4044_90548";
        break;
    case "arts": 
        catNum = "1334134";
        break;
    case "auto":
        catNum = "91083";
        break;
    case "baby": 
        catNum = "5427"
        break;
    case "books": 
        catNum = "3920" 
        break;
    case "clothing": 
        catNum = "5438" 
        break;
    case "computers": 
        catNum = "3944_3951"
        break;
    case "electronics": 
        catNum = "3944" 
        break;
    case "games": 
        catNum = "4171_4191"  
        break;
    case "health": 
        catNum = "976760" 
        break;
    case "home": 
        catNum = "4044" 
        break;
    case "jewelry": 
        catNum = "3891" 
        break;
    case "kitchen": 
        catNum = "4044_623679" 
        break;
    case "pets": 
        catNum = "5440" 
        break;
    case "smarthome": 
        catNum = "3944_1229875"  
        break;
    case "sports":
        catNum = "4125";
        break;
    case "toys":
        catNum = "4171";
        break;
  }

  if (catNum !== "NaN") {
    crunchData(catNum, 0, [], undefined, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));

  } else res.redirect('/');
});

/* GET cart page. */
router.get('/cart.html', function(req, res, next) {
  res.redirect('/cart');
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Deepest Discounts: Cart' });
});

module.exports = router;
