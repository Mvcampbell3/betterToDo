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
    .populate("todos")
    .then(result => {
      // console.log(result);
      res.status(201).json(result)
    })
    .catch(err => {
      console.log(err);
      res.json(200).json(err)
    })
})

router.post("/addProject", checkAuth, (req, res) => {
  db.User.findByIdAndUpdate(req.user.id, { $push: { projects: { name: req.body.project, hide: false } } })
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

router.get("/drop", (req, res) => {
  db.Todo.remove()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

router.delete("/delete/:id", (req, res) => {
  db.Todo.findById(req.params.id)
    .then(todo => {
      if (todo.userID.toString() === req.user.id) {
        todo.remove()
          .then(deleted => {
            res.status(200).json({ deleted, ok: true })
          })
          .catch(err => {
            res.status(400).json({ msg: err })
          })
      } else {
        res.status(200).json({ msg: "Would not Delete, unauthed" })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    })
})

// router.delete("/delete/:id", (req, res) => {
//   res.json({ ok: true })
// })

router.put("/updatecompleted", (req, res) => {
  let { todoID, completed } = req.body;
  console.log(typeof completed);
  if (completed === "false") {
    completed = false
  } else {
    completed = true
  }
  db.Todo.findByIdAndUpdate(todoID, { isCompleted: !completed }, { new: true })
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    })
})

module.exports = router;