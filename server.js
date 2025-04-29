require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/upload");
const videoRoutes = require('./routes/video');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require('./routes/category');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/hls", express.static(path.join(__dirname, "hls")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/upload", uploadRoutes);
app.use('/api/videos', videoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(5000, () => console.log("✅ Server is running on http://localhost:5000"));