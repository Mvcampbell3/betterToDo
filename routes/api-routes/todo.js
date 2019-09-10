const router = require("express").Router();
const db = require("../../models");
const checkAuth = require("../../middleware/checkAuth")

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

router.post("/addProject", checkAuth, (req, res) => {
  db.User.findByIdAndUpdate(req.user.id, { $push: { projects: req.body.project } })
    .then(result => {
      console.log(result);
      res.status(201).json({ success: true })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
    })
})

module.exports = router;