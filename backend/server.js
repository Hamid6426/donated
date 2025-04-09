// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./config/logger.js";
import { connectDB } from "./config/database.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// === Database Connection ===
connectDB();

// === Middleware ===

const corsOptions = {
  origin: "http://localhost:3000", // Replace with the URL of your frontend (Vite-React app)
  credentials: true, // Allows cookies to be sent and received
  methods: ["GET", "POST", "PUT", "DELETE"],
};

if (NODE_ENV === "development") {
  // CORS
  app.use(cors(corsOptions));
  // MORGAN
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

app.use('/api/users', userRouter);
// app.use('/api/items', router);
// app.use('/api/request', router);
// app.use('/api/chat', router);
// app.use('/api/contact', router);

// === Start Server ===
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT} [${NODE_ENV}]`);
  });
});
