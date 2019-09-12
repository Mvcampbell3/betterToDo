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

router.get("/gettodos", checkAuth, (req, res) => {
  db.User.findById(req.user.id)
    .then(user => res.status(200).json({ todos: user.todos, projects: user.projects }))
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
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

router.post("/addTodo", checkAuth, (req, res) => {
  const { project, task } = req.body;
  const userID = req.user.id;

  const newTodo = new db.Todo({
    project,
    task,
    userID
  })

  newTodo.save()
    .then(result => {
      console.log(result);
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

module.exports = router;