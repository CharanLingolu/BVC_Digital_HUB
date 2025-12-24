import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Client Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";

// Admin Routes
import adminAuthRoutes from "./routes/adminAuth.js";
import adminUserRoutes from "./routes/adminUsers.js";
import adminStaffRoutes from "./routes/adminStaff.js";
import adminRoutes from "./routes/adminRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- ADMIN API ENDPOINTS ---
app.use("/api/admin/staff", adminStaffRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

app.use("/api/admin", adminRoutes);

// Existing admin user routes (likely handles /api/admin/users)
app.use("/api/admin", adminUserRoutes);

// --- CLIENT API ENDPOINTS ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/info", infoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
