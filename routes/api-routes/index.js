const router = require("express").Router();
const user_routes = require("./user");
const todo_routes = require("./todo");

router.use("/user", user_routes);
router.use("/todo", todo_routes);

module.exports = router;