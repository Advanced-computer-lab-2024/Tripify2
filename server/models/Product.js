const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationService = require('../config/notification.service');

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
            ref: "User",
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
            type: Boolean
        },
        TotalSales: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

ProductSchema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
        this.options._previousQuantity = docToUpdate.AvailableQuantity;
    }
    next();
});

ProductSchema.post('findOneAndUpdate', async function (doc) {
    try {
        if (this.options._previousQuantity > 0 && doc.AvailableQuantity === 0) {
            const notificationService = new NotificationService();
            const User = mongoose.model('User');

            const adminUsers = await User.find({ Role: 'Admin' });

            const notificationRecipients = new Set();

            notificationRecipients.add(doc.Seller.toString());

            adminUsers.forEach(admin => {
                notificationRecipients.add(admin._id.toString());
            });

            for (const userId of notificationRecipients) {
                await notificationService.createNotification({
                    UserId: userId,
                    Type: 'warning',
                    Message: `Product "${doc.Name}" is now out of stock!`,
                    TargetRoute: '/products/' + doc._id
                });
            }
        }
    } catch (error) {
        console.error('Error in product notification middleware:', error);
    }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
