const User = require("../models/user");
var jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  const isNewUser = await User.isThisEmailUse(email);

  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });

  const user = await User({
    fullname,
    email,
    password,
  });

  await user.save();
  res.json(user);
};

exports.signInUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found, with the given email",
    });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.json({
      sucess: false,
      message: "user not found, with the givern email",
    });

  var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ sucess: true, user: user, token });
};
