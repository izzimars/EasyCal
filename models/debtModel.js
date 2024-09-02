const mongoose = require("mongoose");

const DebtSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  total: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  paymentsLeft: { type: Number, required: true },
  updatedMonth: { type: Number, default: -1 },
});

DebtSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Debt", DebtSchema);
