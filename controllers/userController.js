const User = require("../models/user");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "phone number already registered" });
    }
    const user = new User({ name, phoneNumber, password });
    console.log("hello in backend");
    await user.save();
    const token = jwt.sign({ userName: name }, process.env.JWT_TOKEN, {
      expiresIn: "1hr",
    });

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "signup failed" });
  }
};
const login = async (req, res) => {
    console.log("in login")
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return res.status(400).json({ message: "Feilds cant be empty" });
  }
  const user = await User.findOne({ phoneNumber });
  if (user.password !== password) {
    return res
      .status(400)
      .json({ message: "Phone number or password is Wrong" });
  } else {
    const token = jwt.sign({ name: user.name }, process.env.JWT_TOKEN, {
      expiresIn: "1hr",
    });
    return res.status(201).json({ token });
  }
};
module.exports = { signup, login };
