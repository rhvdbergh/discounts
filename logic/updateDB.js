const { crunchData } = require('./crunchData.js');

function updateDB () {
  
  crunchData(3891, 1, [], undefined, (products) => {
    products.forEach((product) => console.log(product.discountPercentage));
  });
}

exports.updateDB = updateDB;
