var fetch = require('node-fetch');

const { crunchData } = require('./crunchData.js');

const { categories } = require('./categories.js');

const mongoose = require('mongoose');
const Product = require('../models/product.js');

// constants to change functionality
const numIterations = 15;

function retrieveBestsellerProducts() {
  console.log('Now updating bestsellers.')
  fetch(`http://api.walmartlabs.com/v1/feeds/bestsellers?apikey=${process.env.API_KEY}&amp;categoryId=3944`)
    .then(res => res.json())
    .then(json => {
      for (let i = 0; i < json.items.length; i++) 
        if ((json.items[i].msrp && json.items[i].salePrice) && json.items[i].availableOnline && (json.items[i].stock === 'Available')) {
        {

          Product.create({ 

            category: 9999,
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
            productUrl: json.items[i].productUrl,
            discountPercentage: 100-(json.items[i].salePrice / json.items[i].msrp * 100)

          }); // end Product.create
        } // end if
      } // end for

      console.log('Products updated successfully.');
      
    });
  }
  
  function retrieveClearanceProducts() {
    
    fetch(`http://api.walmartlabs.com/v1/feeds/clearance?apikey=${process.env.API_KEY}&amp;categoryId=3944`)
    .then(res => res.json())
    .then(json => {
      for (let i = 0; i < json.items.length; i++) {
        if ((json.items[i].msrp && json.items[i].salePrice) && json.items[i].availableOnline && (json.items[i].stock === 'Available')) {
        
          Product.create({ 
            
            category: 1111,
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
            productUrl: json.items[i].productUrl,
            discountPercentage: 100-(json.items[i].salePrice / json.items[i].msrp * 100)
            
          }); // end Product.create
        } // end if
      } // end for
      console.log('Clearance products updated.');
      retrieveBestsellerProducts();
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
          shortDescription: product.shortDescription,
          thumbnailImage: product.thumbnailImage,
          mediumImage: product.mediumImage,
          largeImage: product.largeImage,
          productTrackingUrl: product.productTrackingUrl,
          productUrl: product.productUrl,
          discountPercentage: product.discountPercentage
        }); // end Product.create()
    }); // end forEach
    categoryPos++;
  
    if (categoryPos >= categoryArray.length) {
      // now update clearance products
      console.log('Now updating clearance products.');
      retrieveClearanceProducts();
    } else {
      recursiveCrunching(categoryPos, categoryArray);
    }
  }); // end crunchData()


}

function updateDB () {

  recursiveCrunching(0, Object.keys(categories));

} // end updateDB()

exports.updateDB = updateDB;
