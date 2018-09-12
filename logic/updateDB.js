var fetch = require('node-fetch');

const { crunchData } = require('./crunchData.js');

const { categories } = require('./categories.js');

const mongoose = require('mongoose');
const Product = require('../models/product.js');

let today = new Date();
let flipFlop = 0;

const linkshareId = process.env.LINKSHARE_ID;

// constants to change functionality
const numIterations = 30;

function retrieveBestsellerProducts() {
  console.log('Now updating bestsellers.')
  fetch(`http://api.walmartlabs.com/v1/feeds/bestsellers?apikey=${process.env.API_KEY}&lsPublisherId=${linkshareId}&amp;categoryId=3944`)
    .then(res => res.json())
    .then(json => {
      for (let i = 0; i < json.items.length; i++) 
        if ((json.items[i].msrp && json.items[i].salePrice) && json.items[i].availableOnline && (json.items[i].stock === 'Available')) {
        {

          let productTrackingUrl = json.items[i].productTrackingUrl.replace('|LSNID|', process.env.LINKSHARE_ID);

          Product.create({ 

            category: 9999,
            itemId: json.items[i].itemId,
            name: json.items[i].name,
            upc: json.items[i].upc,
            msrp: json.items[i].msrp,
            salePrice: json.items[i].salePrice,
            dollarDifference: json.items[i].msrp - json.items[i].salePrice,
            shortDescription: json.items[i].shortDescription,
            thumbnailImage: json.items[i].thumbnailImage,
            mediumImage: json.items[i].mediumImage,
            largeImage: json.items[i].largeImage,
            productTrackingUrl: productTrackingUrl,
            productUrl: json.items[i].productUrl,
            discountPercentage: 100-(json.items[i].salePrice / json.items[i].msrp * 100),
            oldNewFlipFlop: flipFlop

          }); // end Product.create
        } // end if
      } // end for

      console.log('Products updated successfully.');

      console.log('Starting deletion, date is: ', today);
      console.log('Starting deletion, flipFlop is:', flipFlop);

      if (flipFlop === 0) {
        flipFlop = 1;
      } else {
        flipFlop = 0;
      }

      Product.deleteMany({ category: 9999, oldNewFlipFlop: flipFlop }, (err) => {});

      console.log('flipFlop after deletion:', flipFlop);
      
    });
  }
  
function recursiveCrunching(categoryPos, categoryArray) {

  crunchData(categories[categoryArray[categoryPos]], numIterations, [], undefined, (products) => {

    console.log('Now at category', categoryPos, 'which is', categories[categoryArray[categoryPos]]);

    products.forEach((product) => {
      
      console.log(product.discountPercentage)

      // create the MongoDB entry for each product
        Product.create({ 

          category: product.category,
          itemId: product.itemId,
          name: product.name,
          upc: product.upc,
          msrp: product.msrp,
          salePrice: product.salePrice,
          dollarDifference: product.dollarDifference,
          shortDescription: product.shortDescription,
          thumbnailImage: product.thumbnailImage,
          mediumImage: product.mediumImage,
          largeImage: product.largeImage,
          productTrackingUrl: product.productTrackingUrl,
          productUrl: product.productUrl,
          discountPercentage: product.discountPercentage,
          oldNewFlipFlop: flipFlop

        }); // end Product.create()
    }); // end forEach
    categoryPos++;

    if (flipFlop === 0) {
      Product.deleteMany({ category: products[0].category, oldNewFlipFlop: 1 }, (err) => {});
    } else {
      Product.deleteMany({ category: products[0].category, oldNewFlipFlop: 0 }, (err) => {});
    }
  
    if (categoryPos >= categoryArray.length) {
      // now update bestseller products
      console.log('Now updating bestseller products.');
      retrieveBestsellerProducts();
    } else {
      recursiveCrunching(categoryPos, categoryArray);
    }
  }); // end crunchData()
}

function updateDB () {

  today = new Date();
  
  console.log('Starting update, date is', today);

  // flipFlop = process.env.FLIP_FLOP;

  console.log('flipFlop is: ', flipFlop);

  recursiveCrunching(0, Object.keys(categories));
    
} // end updateDB()

exports.updateDB = updateDB;
