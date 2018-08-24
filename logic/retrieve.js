const Product = require('../models/product.js');

function retrieveProducts(retrieveCategory, callback) {
  Product.countDocuments({ category: retrieveCategory })
    .then((numProducts) => {  
      Product.find({ category: retrieveCategory }).limit(24)
        .then((products) => callback(products, numProducts));
    });
}

exports.retrieveProducts = retrieveProducts;