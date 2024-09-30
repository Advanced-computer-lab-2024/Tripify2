const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        Name: {
            type: String,
            required: [true, "Please enter a name for the product"],
        },
        Image: {
            type: String,
        },
        Price: {
            type: Number,
            required: [true, "Please enter a price for the product"],
        },
        Description: {
            type: String,
            required: [true, "Please enter a discription for the product"],
        },
        Seller: {
            type: Schema.Types.ObjectId,
            ref: "Seller",
            required: [true, "Please select a seller for the product"],
        },
        Rating: {
            type: Number,
            default: 0,
        },
        Reviews: [{
            type: Schema.Types.ObjectId,
            ref: "Review",
        }],
        AvailableQuantity: {
            type: Number,
            default: 0,
        },
        Archived: {
            type:Boolean
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
