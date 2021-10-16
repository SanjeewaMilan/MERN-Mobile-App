const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const user = {
  fullname: "",
  email: "",
  avatar: "",
  password: "",
};

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: Buffer,
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is mising,can not compare");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};

//userSchema.methods.isThisEmailUse
userSchema.statics.isThisEmailUse = async function (email) {
  if (!email) throw new Error("Invalid Email");

  try {
    const result = await this.findOne({ email });

    if (result) return false;
    return true;
  } catch (error) {
    console.log("error inside isThisEmailUse method", error.message);
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
