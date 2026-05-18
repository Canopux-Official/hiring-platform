import "dotenv/config";
import app from "./app";
import connectDB from "./config/database";

const PORT = parseInt(process.env.PORT ?? "5000", 10);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV ?? "development"}`);
    });

    // Shutdown handlers for termination.
    const shutdown = (signal: string): void => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log("🔴 HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: unknown) => {
      console.error("🔥 Unhandled Rejection:", reason);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();