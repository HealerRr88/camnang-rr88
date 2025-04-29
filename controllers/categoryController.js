const db = require("../config/db");

exports.getCategories = async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM categories");
    res.json(rows);
};

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    await db.execute("INSERT INTO categories (name) VALUES (?)", [name]);
    res.json({ success: true });
};