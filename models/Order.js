const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
    },
    record: [
        // one to many
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Record'
        },
    ],
});

module.exports = mongoose.model("Order", OrderSchema);
