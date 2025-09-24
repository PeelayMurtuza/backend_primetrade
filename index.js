const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/user");
const cors = require("cors");
const taskRoutes = require("./routes/task");

require("dotenv").config(); 

const app = express();
connectDB();

// Enable CORS for all routes
app.use(cors());

// inbuilt middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
