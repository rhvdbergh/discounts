const { crunchData } = require('./crunchData.js');

const mongoose = require('mongoose');
const Product = require('../models/product.js');

function updateDB () {
  
  crunchData(3891, 1, [], undefined, (products) => {
    products.forEach((product) => {
      
      console.log(product.discountPercentage)

      // create the MongoDB newscloud entry for each product
        Product.create({ 

          category: 3891,
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
        
      
    });
  }

    
    );
  });
}

exports.updateDB = updateDB;
