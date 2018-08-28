const Product = require('../models/product.js');

function retrieveProducts(retrieveCategory, pageNum, sortOrder, callback) {
  Product.countDocuments({ category: retrieveCategory })
    .then((numProducts) => {  

      let amountToSkip = (pageNum-1)*24;
      let redirectToFirstPage = false;

      // if there is a call for more pages than products available, revert to page 1
      if (amountToSkip >= numProducts) {
        redirectToFirstPage = true;
      }

      console.log('inside retrieve, the sort order is', sortOrder);

      if (sortOrder === '1') {
        Product.find({ category: retrieveCategory })
              .sort({dollarDifference: -1})
              .skip(amountToSkip)
              .limit(24)
        .then((products) => callback(products, numProducts, redirectToFirstPage));
      
      } else {  
      // default sort order is by percentage; sortOrder === 0
      Product.find({ category: retrieveCategory })
              .sort({discountPercentage: -1})
              .skip(amountToSkip)
              .limit(24)
        .then((products) => callback(products, numProducts, redirectToFirstPage));
      } // end if ... else
    });
}

exports.retrieveProducts = retrieveProducts;