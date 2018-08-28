const Product = require('../models/product.js');

function retrieveProducts(retrieveCategory, pageNum, priceRange, sortOrder, callback) {
  
  let low = 0;
  let high = 99999;
  
  if (priceRange === '1') {
    high = 20;
  } else if (priceRange === '2') {
    low = 20;
    high = 50;
  } else if (priceRange === '3') {
    low = 50;
    high = 100;
  } else if (priceRange === '4') {
    low = 100;
    high = 200;
  } else if (priceRange === '5') {
    low = 200;
  } 

  Product.countDocuments({ 
      category: retrieveCategory,
      salePrice: { $gte: low , $lte: high }
    })
    .then((numProducts) => {  

      let amountToSkip = (pageNum-1)*24;
      let redirectToFirstPage = false;

      // if there is a call for more pages than products available, revert to page 1
      if (amountToSkip >= numProducts) {
        redirectToFirstPage = true;
      }

      if (sortOrder === '1') {
        Product.find({ category: retrieveCategory, salePrice: { $gte: low , $lte: high } })
              .sort({dollarDifference: -1})
              .skip(amountToSkip)
              .limit(24)
        .then((products) => callback(products, numProducts, redirectToFirstPage));
      
      } else {  
      // default sort order is by percentage; sortOrder === 0
      Product.find({ category: retrieveCategory, salePrice: { $gte: low , $lte: high } })
              .sort({discountPercentage: -1})
              .skip(amountToSkip)
              .limit(24)
        .then((products) => callback(products, numProducts, redirectToFirstPage));
      } // end if ... else
    });
}

exports.retrieveProducts = retrieveProducts;