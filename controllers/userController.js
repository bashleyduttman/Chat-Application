const User = require("../models/user");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username)
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Fields can't be empty" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already registered" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ username }, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });

    return res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Signup failed" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Fields can't be empty" });
  }

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Username or password is wrong" });
  }

  const token = jwt.sign({ username }, process.env.JWT_TOKEN, {
    expiresIn: "1hr",
  });
  return res.status(201).json({ token ,name:username});
};

module.exports = { signup, login };
