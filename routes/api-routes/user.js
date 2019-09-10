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

module.exports = router;