const router = require("express").Router();
const api_routes = require("./api-routes");
const db = require("../models");
const checkAuth = require("../middleware/checkAuth");

router.use("/api", api_routes);

router.get("/", (req, res) => {
  res.render("home")
})

router.get("/login", (req, res) => {
  res.render("login");
})

router.get("/login/success/:id", (req, res) => {
  db.User.findById(req.params.id)
    .then(user => {
      res.render("login", { msg: "You are signed up! All you need to do is login!", email: user.email })
    })
})

router.get("/signup", (req, res) => {
  res.render("signup")
})

router.get("/members", checkAuth, (req, res) => {
  res.render("members")
})

module.exports = router;
