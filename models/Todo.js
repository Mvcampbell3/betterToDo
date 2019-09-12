const mongoose = require("mongoose");
const User = require("./User");

const TodoSchema = new mongoose.Schema({
  project: {
    type: String,
    default: "Common"
  },

  task: {
    type: String,
    requried: true
  },

  isCompleted: {
    type: Boolean,
    default: false
  },

  date: {
    type: Date,
    default: Date.now
  },

  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    requried: true
  }
})

TodoSchema.pre("save", function(next) {
  console.log(this.userID);
  User.findByIdAndUpdate(this.userID, { $push: { todos: this._id } })
    .exec()
    .then(result => {
      console.log(result);
      next();
    })
    .catch(err => console.log(err))
})

TodoSchema.pre("remove", function(next) {
  console.log(this.userID);
  User.findByIdAndUpdate(this.userID, { $pull: { todos: this._id } }, {new: true})
    .then(result => {
      console.log(result)
      next();
    })
    .catch(err => console.log(err))
})

const Todo = mongoose.model("Todo", TodoSchema);

Todo.prototype.changeCompleted = function() {
  this.isCompleted = !this.isCompleted;
}

module.exports = Todo;