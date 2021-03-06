const { retrieveProducts } = require('../logic/retrieve.js');

var express = require('express');
var router = express.Router();
var fs = require('fs');

const { categories } = require('../logic/categories.js');
const { search } = require('../logic/search.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect(`/category/jewelry/0/0/1`);
  
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
  let sortOrder = req.params.sortOrder;
  let priceRange = req.params.priceRange;

  if (catNum !== undefined) {
    retrieveProducts(catNum, pageNum, priceRange, sortOrder, (retrievedProducts, numProducts, redirectToFirstPage) => {
     
      let showingProductEnd = pageNum * 24;
      if (numProducts < 24 || (pageNum * 24) - numProducts > 0) {
        showingProductEnd = (pageNum - 1) * 24 + (numProducts % 24);
      }
      let showingProductStart = ((pageNum - 1) * 24) + 1;
      if (numProducts === 0) {
        showingProductStart =0;
      }

      // redirect if pageNum was too large
      if (redirectToFirstPage && numProducts !== 0) {
        console.log('Redirecting to first page ... page number was too high.');
        res.redirect(`/category/${req.params.category}/${priceRange}/${sortOrder}/1`);
        }
     
      res.render('index', { 
        title: 'DeepestDiscounts.net', 
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

  /* GET search page */
  router.get('/search/:searchTerm', function(req, res, next) {

    search(req.params.searchTerm, (retrievedProducts) => {
      res.render('index', { 
        title: 'DeepestDiscounts.net', 
        products: retrievedProducts, 
        numProducts: retrievedProducts.length,
        pageNum: 1,
        showingProductStart: retrievedProducts.length > 0 ? 1 : 0,
        showingProductEnd: retrievedProducts.length,
        category: 0,
        sortOrder: 0,
        priceRange: 0
      }); // end render
    }); // end search

  });
});

module.exports = router;
