const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ users: true })
})

module.exports = router;