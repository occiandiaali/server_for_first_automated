const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/db"); // Connect to MongoDB

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Parse cookies from incoming requests
app.use(cookieParser());

// ✅ CORS setup to allow credentials (cookies) from frontend
app.use(
  cors({
    origin: "http://localhost:9000", // your frontend origin
    credentials: true, // allow cookies to be sent
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
