const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromoCodeSchema = new Schema(
    {
        Code: {
            type: String,
            required: [true, "Please enter a code"],
            unique: true,
            uppercase: true,
        },
        Type: {
            type: String,
            enum: ["percentage", "fixed"],
            required: [true, "Please specify discount type"],
        },
        Value: {
            type: Number,
            required: [true, "Please enter discount value"],
            min: 0,
        },
        ApplicableToAll: {
            type: Boolean,
            default: true
        },
        EligibleUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    { timestamps: true }
);

PromoCodeSchema.methods.calculateDiscount = function (amount) {
    if (this.Type === "percentage") {
        return (amount * this.Value) / 100;
    }
    return Math.min(this.Value, amount);
};

PromoCodeSchema.methods.isUserEligible = function (userId) {
    if (this.ApplicableToAll) return true;
    return this.EligibleUsers.includes(userId);
};

const PromoCode = mongoose.model("PromoCode", PromoCodeSchema);
module.exports = PromoCode;