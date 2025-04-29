const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

exports.register = async (req, res) => {
  const { username, password, role_id } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.execute("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)", [username, hashed, role_id]);
    res.json({ success: true, message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (!rows.length) return res.status(401).json({ error: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
