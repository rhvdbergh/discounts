const { crunchData } = require('../logic/crunchData.js');
const { retrieveProducts } = require('../logic/retrieve.js');

var express = require('express');
var router = express.Router();
var fs = require('fs');

const { categories } = require('../logic/categories.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  // displays jewelry by default
  // crunchData(3891, 5, [], undefined, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));
  retrieveProducts('3891', (retrievedProducts, numProducts) => {
    res.render('index', { 
      title: 'Deepest Discounts', 
      products: retrievedProducts, 
      numProducts: numProducts 
    });
  });
});

/* GET category page - reroute to pageNum 1. */
router.get('/category/:category', function(req, res, next) {

  res.redirect(`/category/${req.params.category}/1`);

});

/* GET category page. */
router.get('/category/:category/:pageNum', function(req, res, next) {

  let catNum = categories[req.params.category];

  if (catNum !== undefined) {
    retrieveProducts(catNum, (retrievedProducts, numProducts) => {
      res.render('index', { 
        title: 'Deepest Discounts', 
        products: retrievedProducts, 
        numProducts: numProducts 
      });
    });
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
