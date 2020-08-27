const express = require("express");
const mongoose = require("mongoose", { useUnifiedTopology: true });
const app = express();
const passport = require('passport');

const bodyparser = require("body-parser");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");

const db = require("./config/keys").mongoURI;

app.use(bodyparser.urlencoded({ extended: false }));

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config

require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/post", post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("running on port 5000"));
