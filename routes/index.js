var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {


  // displays trending
  console.log(process.env.API_KEY);
  fetch(`http://api.walmartlabs.com/v1/trends?format=json&apiKey=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(json => {
        let products = [];
        for (let i = 0; i < 12; i++) {
          let product = {
            itemID: json.items[i].itemID,
            name: json.items[i].name,
            msrp: json.items[i].msrp,
            salePrice: json.items[i].salePrice,
            thumbnailImage: json.items[i].thumbnailImage,
            mediumImage: json.items[i].mediumImage,
            largeImage: json.items[i].largeImage,
            productTrackingUrl: json.items[i].productTrackingUrl,
            productUrl: json.items[i].productUrl
          }
          products.push(product)
        }
        console.log(products);

        res.render('index', { title: 'Deepest Discounts', products: products })
      });
});

/* GET home page. */
router.get('/cart.html', function(req, res, next) {
  res.redirect('/cart');
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Deepest Discounts: Cart' });
});

module.exports = router;
