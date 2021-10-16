const express = require("express");

const router = express.Router();
const { createUser, signInUser } = require("../controllers/user");
const {
  validateUserSignUp,
  validateUserSignIn,
  validationResult,
} = require("../middlewares/validation/user");
const { isAuth } = require("../middlewares/auth");
const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};
const uploads = multer({ storage, filter: fileFilter });
const User = require("../models/user");
router.post("/create_user", validateUserSignUp, validationResult, createUser);
router.post("/user_signin", validateUserSignIn, validationResult, signInUser);
/* router.post("/create-post", isAuth, (req, res) => {
  res.send("welcome ue in secrete ");
}); */

router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  async (req, res) => {
    const { user } = req;

    if (!user)
      return res
        .status(401)
        .json({ sucess: false, message: "Unauthorize Access!" });

    if (!req.file) return res.json({ sucess: false, message: "No file!" });

    try {
      //resize image
      const profileBuffer = req.file.buffer;
      // const imageInfo = await sharp(profileBuffer).metadata();
      // console.log(imageInfo);

      const { width, height } = await sharp(profileBuffer).metadata();

      const avatar = await sharp(profileBuffer)
        .resize(Math.round(width * 0.5), Math.round(height * 0.5))
        .toBuffer();
      await User.findByIdAndUpdate(user._id, { avatar });
      res.status(201).json({ success: true, message: "Image Uploaded" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
      console.log("Error while uploading profile image", error.message);
    }
  }
);

module.exports = router;
