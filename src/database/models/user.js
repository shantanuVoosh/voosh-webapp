const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  logs:{
      type: Array,
  }
});

module.exports = mongoose.model("Voosh-user", userSchema);
