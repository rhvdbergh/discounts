var fetch = require('node-fetch');

function search(searchTerm, callback) {

  let products = [];

  fetch(`http://api.walmartlabs.com/v1/search?query=${searchTerm}&lsPublisherId=${process.env.LINKSHARE_ID}&format=json&apiKey=${process.env.API_KEY}&numItems=24`)
    .then(res => res.json())
    .then(json => {

      for (let i = 0; i < json.items.length; i++) {
        let product = {

          category: 0,
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
          productTrackingUrl: json.items[i].productTrackingUrl,
          productUrl: json.items[i].productUrl,
          discountPercentage: 100-(json.items[i].salePrice / json.items[i].msrp * 100)
        }   

        products.push(product);

      }
      
      callback(products);
    }); // end fetch
}

exports.search = search;