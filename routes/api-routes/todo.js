const router = require("express").Router();
const db = require("../../models");

router.get("/", (req, res) => {
  db.Todo.find()
    .then(todos => {
      res.status(200).json(todos)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err })
    })
})

module.exports = router;