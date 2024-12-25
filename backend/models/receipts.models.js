const mongoose = require("mongoose"); 

const receiptSchema = new mongoose.Schema({
  businessName: { 
    type: String, 
    required: true 
  },
  businessEmail: { 
    type: String, 
    required: true 
  },
  transactionAmount: { 
    type: Number, 
    required: true 
  },
  transactionDate: { 
    type: Date, 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["unpaid", "paid"], 
    default: "unpaid" 
  },
  adminID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin", 
    required: true 
  },
});

const Receipt = mongoose.model("Receipt", receiptSchema);

module.exports = Receipt;