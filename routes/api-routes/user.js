const router = require("express").Router();
const db = require("../../models")
const bcrypt = require("bcrypt");
const passport = require("../../middleware/passport");

router.get("/", (req, res) => {
  db.User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err })
    })
})

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ success: true })
})

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  db.User.findOne({ email })
    .then(user => {
      if (!user) {
        const newUser = new db.User({
          email,
          username,
          password
        })

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser.save()
              .then(result => {
                console.log(result);
                res.status(201).json({ success: true, id: result._id })
              })
              .catch(err => {
                console.log(err);
                res.status(422).json({ success: false, err });
              })
          })
        })
      } else {
        res.status(422).json({ success: false, msg: "Email is already registered" })
      }
    })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/")
})

router.get("/drop", (req, res) => {
  db.User.remove()
    .then(result => {
      console.log(result);
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

router.put("/hideproject", (req, res) => {
  const { projectName, hide } = req.body;
  db.User.update({ _id: req.user.id, "projects.name": projectName }, { "$set": { "projects.$.hide": hide } }, (err, result) => {
    if (err) {
      console.log(err);
      return res.json(err)
    }
    res.status(200).json(result)
  })
})

router.put("/deleteproject", (req, res) => {
  console.log(req.body)
  const projectName = req.body.projectName;
  console.log('//////////////////')
  console.log(projectName)
  console.log('//////////////////')
  // None of this is working correctly
  db.User.findByIdAndUpdate(req.user.id, { $pull: { projects: { name: projectName } } })
    .then(user => {
      console.log(user)
      // res.json(user)
      let promiseArr = []
      db.Todo.find({ project: projectName })
        .then(todos => {
          todos.forEach(one => promiseArr.push(one.remove()));
          console.log(promiseArr);
          Promise.all(promiseArr)
            .then(done => {
              console.log(done);
              res.json({ ok: true })
            })
            .catch(err => {
              console.log(err);
              res.json(err)
            })
        })
        .catch(err => {
          console.log(err);
          res.json(err);
        })
    })
    .catch(err => {
      res.json(err)
    })
})

module.exports = router;