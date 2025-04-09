// logger.js
import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize } = winston.format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Always log to the console
const transportsArray = [
  new winston.transports.Console({
    format: combine(
      colorize(), // only applies to console logs
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat
    )
  })
];

// In production, add file transport for errors
if (process.env.NODE_ENV === "production") {
  transportsArray.push(
    new winston.transports.File({
      filename: path.join("logs", "error.log"), // error logs go here during production only
      level: "error",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
      handleExceptions: true
    })
  );
}

const logger = winston.createLogger({
  level: "info",
  transports: transportsArray,
  exitOnError: false
});

export default logger;
