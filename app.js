const express = require("express");
require("dotenv").config();

require("./models/db");
const User = require("./models/user");

const userRouter = require("./routes/user");

const app = express();
app.use(express.json());

/* const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await user.comparePassword(password);

  console.log(result);
};

test("san2@gmail.com", "12"); */

app.get("/", (req, res) => {
  //res.send("<h1 style='color:red'>Hello World</h1>");
  res.send("Home");
});

app.use(userRouter);

app.listen(8000, () => {
  console.log("port is listing");
});
