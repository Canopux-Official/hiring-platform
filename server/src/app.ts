// import express, { Application } from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import rateLimit from "express-rate-limit";

// import authRoutes from "./routes/authRoutes";
// import jobRoutes from "./routes/jobRoutes";
// import applicationRoutes from "./routes/applicationRoutes";
// import profileRoutes from "./routes/profileRoutes";
// import adminRoutes from "./routes/adminRoutes";

// import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler";

// const app: Application = express();


// // Security.
// app.use(helmet());
// app.use(
//   cors({
//     origin: [
//       process.env.CLIENT_URL ?? "http://localhost:5173",
//       "http://localhost:5173",
//       "http://127.0.0.1:5173",
//       "http://localhost:3000"
//     ],
//     credentials: true,
//   })
// );

// const isDev = process.env.NODE_ENV === "development";

// // Rate Limiting.
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: isDev ? 99999 : 100,
//   message: { success: false, message: "Too many requests, please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: isDev ? 99999 : 10,
//   message: { success: false, message: "Too many login attempts. Please try again later." },
// });
// app.use("/api", limiter);


// // Body Parsing and Cookie Handling.
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Logger.
// if (process.env.NODE_ENV !== "test") {
//   app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// }


// // Health Check.
// app.get("/api/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Hiring Platform API is running",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//   });
// });


// // Routes. 
// app.use("/api/auth", authLimiter, authRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/applications", applicationRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/admin", adminRoutes);


// // Error Handling.
// app.use(notFoundHandler);
// app.use(globalErrorHandler);

// export default app;


import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import profileRoutes from "./routes/profileRoutes";
import adminRoutes from "./routes/adminRoutes";

import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler";

const app: Application = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL ?? "http://localhost:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});
app.use("/api", limiter);

// Body Parsing and Cookie Handling
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use(morgan("combined"));

// Health Check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Hiring Platform API is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;