const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./routes");
const passport = require("./middleware/passport");
const session = require("express-session");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({
  extname: "handlebars",
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials"
}));

app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(session({ secret: "secretgoeshere", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bettertodo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log("MongoDB connected") }).catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
})