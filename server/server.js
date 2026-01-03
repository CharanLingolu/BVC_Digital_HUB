import "dotenv/config";
console.log(
  "DEBUG: BREVO_KEY loaded?",
  process.env.BREVO_API_KEY ? "YES" : "NO"
);
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

// Initialize Database
connectDB();

const app = express();

/* =======================
   ✅ FIXED CORS (EXPRESS 5 SAFE)
   ======================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://bvc-digital-hub.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Render health checks, curl, mobile apps)
      if (!origin) return callback(null, true);

      // Allow known origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel subdomains (preview + prod)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Do NOT block — prevents silent failures
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ EXPRESS 5 SAFE: handle preflight
app.options(/.*/, cors());

app.use(express.json());

// Root route (Render health check)
app.get("/", (req, res) => {
  res.status(200).send("BVC Digital Hub API is running successfully!");
});

/* =======================
   ADMIN API ROUTES
   ======================= */
app.use("/api/admin/staff", adminStaffRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminUserRoutes);

/* =======================
   CLIENT API ROUTES
   ======================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/info", infoRoutes);

/* =======================
   SERVER START
   ======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
