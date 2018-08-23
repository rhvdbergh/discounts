const { crunchData } = require('../logic/crunchData.js');

var express = require('express');
var router = express.Router();
var fs = require('fs');

const { categories } = require('../logic/categories.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  // displays jewelry by default
  crunchData(3891, 5, [], undefined, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));
  
});

/* GET category page. */
router.get('/category/:category', function(req, res, next) {

  let catNum = categories[req.params.category];

  if (catNum !== undefined) {
    crunchData(catNum, 5, [], undefined, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));

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
