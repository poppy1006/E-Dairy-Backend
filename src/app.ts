import {
  Application,
  ErrorRequestHandler,
  RequestHandler,
  default as express,
} from "express";
import { default as cors } from "cors";
import { default as compression } from "compression";
import helmet from "helmet";
import "express-async-errors";
import httpContext from "express-http-context";
import { responseEnhancer } from "@faatlab/express-response-formatter";


import { createRoutes } from "@faatlab/express-decorator";
import requestLogger from "./middleware/requestLogger";
import { allowedOrigins } from "./helper/constants";
import { errorHandler, prismaErrorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found-handler";
import { rateLimiter } from "./middleware/rateLimiter";
import { controllers } from "./modules";
import { generateUniqueId } from "./helper/functions/generateUniqueId";
import logger from "./helper/logger";


//options for cors midddleware
const env = process.env.NODE_ENV != undefined ? process.env.NODE_ENV : "local";
const options: cors.CorsOptions = {
  origin: allowedOrigins[env as keyof typeof allowedOrigins],
};

const app: Application = express();

// middleware
app.use(helmet());
app.use(cors());
// app.use(compression());
app.use(express.json());
app.use(requestLogger as RequestHandler);
app.use(responseEnhancer() as RequestHandler);
app.use(httpContext.middleware as RequestHandler);
app.use((req, res, next) => {
  httpContext.set("requestId", generateUniqueId("REQ").split("-").join(""));
  if (!req.originalUrl.includes("/docs")) {
    logger.info(`Requesting ${req.method} ${req.originalUrl}`, {
      tags: "http",
      additionalInfo: {
        body: req.body,
        headers: req.headers,
        params: req.params,
        query: req.query,
        ip: req.ip,
      },
    });
  }
  next();
});
app.use(rateLimiter);

// routes
const NODE_ENV = <string>process.env.NODE_ENV;
const api_doc_config = {
  set_title: "<Project_Name>",
  set_description: "Rest API documentation for <Project_Name>",
  set_version: "1.0.0",
  enabled: NODE_ENV === "local" || NODE_ENV === "development" ? true : false,
};
createRoutes(app, controllers, api_doc_config);

// error handler middleware
app.use(prismaErrorHandler as ErrorRequestHandler);
app.use(errorHandler as ErrorRequestHandler);
app.use(notFoundHandler as RequestHandler);

export default app;
