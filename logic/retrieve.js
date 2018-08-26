const Product = require('../models/product.js');

function retrieveProducts(retrieveCategory, pageNum, callback) {
  Product.countDocuments({ category: retrieveCategory })
    .then((numProducts) => {  

      let amountToSkip = (pageNum-1)*24;
      let redirectToFirstPage = false;

      // if there is a call for more pages than products available, revert to page 1
      if (amountToSkip >= numProducts) {
        redirectToFirstPage = true;
      }
      Product.find({ category: retrieveCategory }).skip(amountToSkip).limit(24)
        .then((products) => callback(products, numProducts, redirectToFirstPage));
    });
}

exports.retrieveProducts = retrieveProducts;