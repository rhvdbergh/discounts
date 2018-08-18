var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {


  // displays trending
  console.log(process.env.API_KEY);
  fetch(`http://api.walmartlabs.com/v1/trends?format=json&apiKey=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(json => res.render('index', { title: 'Deepest Discounts', json: json.items[0].name }));
});

/* GET home page. */
router.get('/cart.html', function(req, res, next) {
  res.redirect('/cart');
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Deepest Discounts: Cart' });
});

module.exports = router;
