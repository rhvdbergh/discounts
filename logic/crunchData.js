var fetch = require('node-fetch');

// helper method to make sure the array remains sorted
function findPositionInSortedArray(discountPercentage, products) {

  let posNotFound = true;
  let pos = products.length; // unless this discount is larger than any others, it will be the last

  for (i = 0; i < products.length; i++) {
    if ((discountPercentage > products[i].discountPercentage) && posNotFound) {
      pos = i;
      posNotFound = false;
    }
  }

  return pos;
}

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

      if (json.items.length) { // test if there actually is an item
          for (let i = 0; i < json.items.length; i++) {
            if ((json.items[i].msrp 
                  && json.items[i].salePrice) 
                  && json.items[i].availableOnline 
                  && (json.items[i].stock === 'Available')
                  && (json.items[i].category !== '4044_90548_1231929') // eliminates appliances parts
            ) {
              if ((json.items[i].msrp > json.items[i].salePrice) && (json.items[i].msrp !== 0) && (json.items[i].msrp !== 9999)) {
                const discountPerc = 100-(json.items[i].salePrice / json.items[i].msrp * 100);
                if (discountPerc >= 50 && discountPerc <= 90) { // range: between 50 and 90
                let product = {

                      category: category,
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

                // test if product is a better discount than one already in the array
                if (products.length > 0) { 

                  products.splice(findPositionInSortedArray(product.discountPercentage, products), 0, product);

                  if (products.length > 240) { // there are more than 200 products, so drop one
                    products.pop();
                  }

                } else { // this must be the first viable product
                  products.push(product);
                }

              }
            }
            }
          } // end for
        } // end if length

      if(iterationCount < 1) {
        callback(products);
      } else {
        crunchData(category, iterationCount, products, json.nextPage, callback);
      }
    });

}
exports.crunchData = crunchData;