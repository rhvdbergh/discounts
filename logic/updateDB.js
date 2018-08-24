const { crunchData } = require('./crunchData.js');

const { categories } = require('./categories.js');

const mongoose = require('mongoose');
const Product = require('../models/product.js');

function recursiveCrunching(categoryPos, categoryArray) {

  crunchData(categories[categoryArray[categoryPos]], 1, [], undefined, (products) => {

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
      console.log('finished');
    } else {
      recursiveCrunching(categoryPos, categoryArray);
    }
  }); // end crunchData()


}

function updateDB () {

  recursiveCrunching(0, Object.keys(categories));

} // end updateDB()

exports.updateDB = updateDB;
