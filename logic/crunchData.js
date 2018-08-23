var fetch = require('node-fetch');

function crunchData(category, iterationCount, products, nextPage, callback) {
  
  console.log(iterationCount);
  iterationCount--;

  let urlToFetch = nextPage ? 
      `http://api.walmartlabs.com${nextPage}`
      :
      `http://api.walmartlabs.com/v1/paginated/items?category=${category}&apiKey=${process.env.API_KEY}&format=json`;
  fetch(urlToFetch)
    .then(res => res.json())
    .then(json => {

      for (let i = 0; i < json.items.length; i++) {
        if ((json.items[i].msrp && json.items[i].salePrice) && json.items[i].availableOnline && (json.items[i].stock === 'Available')) {
          if ((json.items[i].msrp > json.items[i].salePrice) && (json.items[i].msrp !== 0) && (json.items[i].msrp !== 9999)) {
            if (100-(json.items[i].salePrice / json.items[i].msrp * 100) >= 50) {
            let product = {
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
                  productUrl: json.items[i].productUrl
            }
            products.push(product);
          }
        }
        }
      }

      if(iterationCount < 1) {
        callback(products);
      } else {
        crunchData(category, iterationCount, products, json.nextPage, callback);
      }
    });

}
exports.crunchData = crunchData;