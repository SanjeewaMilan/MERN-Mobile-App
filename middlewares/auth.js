const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ");
      const decode = jwt.verify(token[1], process.env.JWT_SECRET);

      const user = await User.findById(decode.userId);

      if (!user) {
        return res.json({ sucess: false, message: "unauthorized access!" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ sucess: false, message: "unauthorized access!" });
      } else {
        return res.json({ sucess: false, message: error.name });
      }
    }
  } else {
    return res.json({ sucess: false, message: "unauthorized access!" });
  }
};
