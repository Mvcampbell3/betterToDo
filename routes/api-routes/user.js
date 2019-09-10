const router = require("express").Router();
const db = require("../../models")

router.get("/", (req, res) => {
  db.User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({err})
    })
})

module.exports = router;