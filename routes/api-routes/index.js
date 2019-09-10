const router = require("express").Router();
const user_routes = require("./user");

router.use("/user", user_routes);


module.exports = router;