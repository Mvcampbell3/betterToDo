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
  },

  password: {
    type: String,
    required: true
  },

  date: {
    type: Date, 
    default: Date.now
  },

  todos: {
    type: [mongoose.Schema.Types.ObjectID],
    ref: "Todo",
    default: []
  },

  projects: {
    type: Array, 
    default: []
  }

})

const User = mongoose.model("User", UserSchema);

User.prototype.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = User;