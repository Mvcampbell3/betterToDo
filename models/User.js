const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },

  password: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo", default: [] }],

  projects: {
    type: [Object],
    default: []
  }

})

const User = mongoose.model("User", UserSchema);

User.prototype.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = User;