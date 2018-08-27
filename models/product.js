'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Schema: Products 
var ProductsSchema = new Schema({

    category: { type: String, required: true },
    itemId: { type: String },
    name: { type: String },
    upc: { type: String },
    msrp: { type: Number },
    salePrice: { type: Number },
    dollarDifference: { type: Number },
    shortDescription: { type: String },
    thumbnailImage: { type: String },
    mediumImage: { type: String },
    largeImage: { type: String },   
    productTrackingUrl: { type: String },
    productUrl: { type: String },    
    discountPercentage: { type: Number }
});

module.exports = mongoose.model("Products", ProductsSchema);
