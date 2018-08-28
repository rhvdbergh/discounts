const { retrieveProducts } = require('../logic/retrieve.js');

var express = require('express');
var router = express.Router();
var fs = require('fs');

const { categories } = require('../logic/categories.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect(`/category/clearance/0/0/1`);
  
});

/* GET category page. */
router.get('/category/:category/:priceRange/:sortOrder/:pageNum', function(req, res, next) {

  let catNum = categories[req.params.category];
  if (req.params.category === 'clearance') {
    catNum = '1111';
  }
  if (req.params.category === 'bestsellers') {
    catNum = '9999';
  }
  
  let pageNum = req.params.pageNum;
  let showingProductEnd = pageNum * 24;
  let showingProductStart = ((pageNum - 1) * 24) + 1;
  let sortOrder = req.params.sortOrder;
  let priceRange = req.params.priceRange;

  if (catNum !== undefined) {
    retrieveProducts(catNum, pageNum, priceRange, sortOrder, (retrievedProducts, numProducts, redirectToFirstPage) => {
     
      // redirect if pageNum was too large
      if (redirectToFirstPage && numProducts !== 0) {
        console.log('Redirecting to first page ... page number was too high.');
        res.redirect(`/category/${req.params.category}/${sortOrder}/1`);
        }
     
      res.render('index', { 
        title: 'Deepest Discounts', 
        products: retrievedProducts, 
        numProducts: numProducts,
        pageNum: pageNum,
        showingProductStart: showingProductStart,
        showingProductEnd: showingProductEnd,
        category: req.params.category,
        sortOrder: sortOrder,
        priceRange: priceRange
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
