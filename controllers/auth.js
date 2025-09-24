const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/auth");

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // hash password here
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword, role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email" });

    // compare password here
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = createToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
