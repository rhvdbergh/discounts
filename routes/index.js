var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

  fetch (`http://api.walmartlabs.com/v1/paginated/items?category=3891&apiKey=${process.env.API_KEY}&format=json`)
    .then(res => res.json())
    .then(json => {

      fs.writeFile('dev/rollback.txt', JSON.stringify(json), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

    });

  // displays clearance
  fetch(`http://api.walmartlabs.com/v1/paginated/items?category=3944_3951&apiKey=${process.env.API_KEY}&format=json`)
      .then(res => res.json())
      .then(json => {
        let products = [];
        let viableCount = 0;
        let totalMSRP = 0;
        let totalSalePrice = 0;
        let discountPercentages = [];
        let numProductsOnScreen = 0;

        for (let i = 0; i < json.items.length; i++) {
          if ((json.items[i].msrp && json.items[i].salePrice) && json.items[i].availableOnline && (json.items[i].stock === 'Available')) {
            if ((json.items[i].msrp > json.items[i].salePrice) && (json.items[i].msrp !== 0) && (json.items[i].msrp !== 9999)) {
              if (100-(json.items[i].salePrice / json.items[i].msrp * 100) >= 50) {
              viableCount++;
              totalMSRP += json.items[i].msrp;
              totalSalePrice+= json.items[i].salePrice;
              discountPercentages.push(100-(json.items[i].salePrice / json.items[i].msrp * 100));

              if (numProductsOnScreen < 12) {
                let product = {
                      itemId: json.items[i].itemId,
                      name: json.items[i].name,
                      upc: json.items[i].upc,
                      msrp: json.items[i].msrp,
                      salePrice: json.items[i].salePrice,
                      shortDescription: json.items[i].shortDescription,
                      thumbnailImage: json.items[i].thumbnailImage,
                      mediumImage: json.items[i].mediumImage,
                      largeImage: json.items[i].largeImage,
                      productTrackingUrl: json.items[i].productTrackingUrl,
                      productUrl: json.items[i].productUrl
                }
                products.push(product);
                console.log(product.productUrl);
                numProductsOnScreen++;
              }
            }
          }
          }
        }

        console.log('viableCount', viableCount);
        console.log('totalMSRP', totalMSRP);
        console.log('totalSalePrice', totalSalePrice);
        console.log('average discount in percentages', discountPercentages.reduce((acc, val) => acc + val) / discountPercentages.length);

        // for (let i = 0; i < 12; i++) {
        //   let product = {
        //     itemId: json.items[i].itemId,
        //     name: json.items[i].name,
        //     msrp: json.items[i].msrp,
        //     salePrice: json.items[i].salePrice,
        //     thumbnailImage: json.items[i].thumbnailImage,
        //     mediumImage: json.items[i].mediumImage,
        //     largeImage: json.items[i].largeImage,
        //     productTrackingUrl: json.items[i].productTrackingUrl,
        //     productUrl: json.items[i].productUrl
        //   }
        //   products.push(product)
        // }
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
