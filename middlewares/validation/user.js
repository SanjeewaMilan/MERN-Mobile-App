const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("fullname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Must be a valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be with in 3 to 20 character"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is empty!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Password must be with in 3 to 20 character"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both password must be same!");
      }
      return true;
    }),
];

exports.validationResult = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check("email").trim().isEmail().withMessage("Email / Password required"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email / Password required"),
];
