import winston, { format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

const logger = winston.createLogger({
  format: combine(timestamp(), json(), colorize()),
  transports: [new transports.Console()],
});

export default logger;