"use strict";

const http = require("node:http");
const logger = require("./modules/logger");

const routes = {
  "/": "Welcome to the Smart Utility Toolkit!",
  "/about": "About: This server is built with Node.js and the http core module.",
  "/contact": "Contact: webdev3@example.com",
};

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
}

function createServer() {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const pathname = requestUrl.pathname;

    logger.log(`[server] ${request.method} ${pathname}`);

    if (request.method !== "GET") {
      sendText(response, 405, "Method Not Allowed");
      return;
    }

    if (Object.hasOwn(routes, pathname)) {
      sendText(response, 200, routes[pathname]);
      return;
    }

    sendText(response, 404, "404 - Route not found");
  });
}

function getPort() {
  const port = Number(process.env.PORT || 3000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function startServer() {
  try {
    const port = getPort();
    const server = createServer();

    server.on("error", (error) => {
      logger.error(`[server] Unable to start: ${error.message}`);
      process.exitCode = 1;
    });

    logger.log("[server] Starting HTTP server...");
    server.listen(port, () => {
      logger.log(`[server] Listening at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(`[server] Configuration error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { createServer, getPort };
