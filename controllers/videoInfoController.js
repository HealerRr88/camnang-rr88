const db = require("../config/db");

exports.createVideo = async (req, res) => {
    const { title, description, path, upload_id, category_id } = req.body;
    const thumbPath = req.file ? "/uploads/thumbs/" + req.file.filename : null;

    try {
        const [result] = await db.execute(
            "INSERT INTO videos (title, description, thumb, path, upload_id, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [title, description, thumbPath, path, upload_id, category_id]
        );

        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Insert error" });
    }
};


exports.getVideoById = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT v.*, u.status FROM videos v JOIN upload_videos u ON v.upload_id = u.id WHERE v.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: "Video not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const [rows] = await db.execute("DELETE FROM videos WHERE id = ?", [req.params.id]);
        if (rows.affectedRows === 0) return res.status(404).json({ error: "Video not found" });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete error" });
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT v.*, u.name FROM videos v JOIN categories u ON u.id = v.category_id  ORDER BY v.created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Get all error" });
    }
};

exports.getLatestVideo = async (req, res) => {
    const { category_id } = req.query;

    try {
        const [rows] = await db.execute(
            `SELECT * FROM videos 
         WHERE category_id = ? 
         ORDER BY created_at DESC 
         LIMIT 1`,
            [category_id]
        );

        if (rows.length > 0) {
            res.json(rows[0]); // trả về video mới nhất
        } else {
            res.status(404).json({ error: "Không tìm thấy video" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
    }

};

exports.getVideosByCategory = async (req, res) => {
    const { category_id } = req.query;

    try {
        const [videos] = await db.query(
            "SELECT * FROM videos WHERE category_id = ? ORDER BY created_at DESC",
            [category_id]
        );
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }

};

const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.updateVideo = async (req, res) => {
    const { id } = req.params;
    const { title, description, path, upload_id, category_id, thumbOld } = req.body || {};

    let fields = [];
    let values = [];

    try {
        if (req.file) {
            const thumb = `/uploads/thumbs/${req.file.filename}`;
            fields.push("thumb = ?");
            values.push(thumb);
        } else if (thumbOld) {
            fields.push("thumb = ?");
            values.push(thumbOld);
        }

        if (typeof title !== 'undefined') {
            fields.push("title = ?");
            values.push(title);
        }
        if (typeof description !== 'undefined') {
            fields.push("description = ?");
            values.push(description);
        }
        if (typeof path !== 'undefined') {
            fields.push("path = ?");
            values.push(path);
        }
        if (typeof upload_id !== 'undefined') {
            fields.push("upload_id = ?");
            values.push(upload_id);
        }
        if (typeof category_id !== 'undefined') {
            fields.push("category_id = ?");
            values.push(category_id);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật!" });
        }

        const sql = `UPDATE videos SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.query(sql, [...values, id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Không tìm thấy video để cập nhật hoặc dữ liệu không thay đổi!" });
        }

        res.json({ message: "Cập nhật thành công!" });

    } catch (error) {
        console.error("Lỗi update video:", error);
        res.status(500).json({ message: "Có lỗi khi cập nhật video" });
    }
};










