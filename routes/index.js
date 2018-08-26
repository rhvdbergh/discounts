const { crunchData } = require('../logic/crunchData.js');
const { retrieveProducts } = require('../logic/retrieve.js');

var express = require('express');
var router = express.Router();
var fs = require('fs');

const { categories } = require('../logic/categories.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect(`/category/jewelry/1`);
  
});

/* GET category page - reroute to pageNum 1. */
router.get('/category/:category', function(req, res, next) {

  res.redirect(`/category/${req.params.category}/1`);

});

/* GET category page. */
router.get('/category/:category/:pageNum', function(req, res, next) {

  let catNum = categories[req.params.category];
  let pageNum = req.params.pageNum;
  let showingProductEnd = pageNum * 24;
  let showingProductStart = ((pageNum - 1) * 24) + 1;

  if (catNum !== undefined) {
    retrieveProducts(catNum, pageNum, (retrievedProducts, numProducts, redirectToFirstPage) => {
     
      // redirect if pageNum was too large
      if (redirectToFirstPage && numProducts !== 0) {
      res.redirect(`/category/${req.params.category}/1`);
        }
     
      res.render('index', { 
        title: 'Deepest Discounts', 
        products: retrievedProducts, 
        numProducts: numProducts,
        showingProductStart: showingProductStart,
        showingProductEnd: showingProductEnd
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
