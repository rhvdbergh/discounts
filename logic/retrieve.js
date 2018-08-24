const Product = require('../models/product.js');

function retrieveProducts(retrieveCategory, callback) {
  Product.find({ category: retrieveCategory }).limit(12)
    .then((products) => callback(products));
}

exports.retrieveProducts = retrieveProducts;