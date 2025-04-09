// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./config/logger.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// === Database Connection ===
connectDB();

// === Middleware ===
if (NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  logger.info("[DEV MODE] CORS and HTTP logging enabled");
} else {
  app.use(cors());
  logger.info("[PROD MODE] CORS enabled (default settings)");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Routes ===
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// === Start Server ===
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT} [${NODE_ENV}]`);
  });
});
