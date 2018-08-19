var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

  fetch (`http://api.walmartlabs.com/v1/feeds/bestsellers?apikey=${process.env.API_KEY}&amp;categoryId=3944`)
    .then(res => res.json())
    .then(json => {

      fs.writeFile('bestsellers.txt', JSON.stringify(json), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

    });

  // displays clearance
  fetch(`http://api.walmartlabs.com/v1/feeds/bestsellers?apikey=${process.env.API_KEY}&amp;categoryId=3944`)
      .then(res => res.json())
      .then(json => {
        let products = [];
        for (let i = 0; i < 12; i++) {
          let product = {
            itemId: json.items[i].itemId,
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
