var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

function findProducts(category, callback) {

  fetch(`http://api.walmartlabs.com/v1/paginated/items?category=${category}&apiKey=${process.env.API_KEY}&format=json`)
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
      callback(products);
    });

}

/* GET home page. */
router.get('/', function(req, res, next) {

  // displays jewelry by default
  findProducts(3891, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));
  
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
    case "musicalinstruments": 
        catNum = "7796869"  
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
    findProducts(catNum, (products) => res.render('index', { title: 'Deepest Discounts', products: products }));
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
