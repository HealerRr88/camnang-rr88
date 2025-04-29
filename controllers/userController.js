// controllers/userController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.createUser = async (req, res) => {
  try {
    const { username, password, role_id } = req.body;

    // Kiểm tra input có đầy đủ không
    if (!username || !password || !role_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (username, password, role_id, created_at) VALUES (?, ?, ?, NOW())',
      [username, hash, role_id]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create user failed' });
  }
};


exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role_id } = req.body;
  
    try {
      const fields = [];
      const values = [];
  
      if (username) {
        fields.push("username = ?");
        values.push(username);
      }
  
      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        fields.push("password = ?");
        values.push(hashed);
      }
  
      if (role_id) {
        fields.push("role_id = ?");
        values.push(role_id);
      }
  
      if (fields.length === 0) {
        return res.status(400).json({ error: "No data to update" });
      }
  
      values.push(id); // cho WHERE
  
      const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      await db.execute(sql, values);
  
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute("DELETE FROM users WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getAllUsers = async (req, res) => {
      try {
          const [rows] = await db.execute(
              `SELECT users.*, roles.name AS role_name FROM users JOIN roles ON users.role_id = roles.id  ORDER BY users.created_at DESC`
          );
          res.json(rows);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Get all error" });
      }
  };
