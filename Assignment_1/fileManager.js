"use strict";

const fs = require("node:fs");
const path = require("node:path");
const logger = require("./modules/logger");

const validCommands = new Set(["create", "read", "update", "delete"]);

function showUsage() {
  logger.warn("Usage:");
  logger.warn('  node fileManager.js create <file-name> "content"');
  logger.warn("  node fileManager.js read <file-name>");
  logger.warn('  node fileManager.js update <file-name> "content"');
  logger.warn("  node fileManager.js delete <file-name>");
}

function filePathFor(fileName) {
  if (!fileName || fileName !== path.basename(fileName) || fileName === "." || fileName === "..") {
    throw new Error("Use a simple file name without folders or path traversal.");
  }

  return path.join(__dirname, fileName);
}

function describeError(error, fileName) {
  if (error.code === "ENOENT") {
    return `File "${fileName}" does not exist.`;
  }

  return error.message;
}

function reportResult(error, successMessage, fileName) {
  if (error) {
    logger.error(`[file-manager] Error: ${describeError(error, fileName)}`);
    process.exitCode = 1;
    return;
  }

  logger.success(`[file-manager] ${successMessage}`);
}

function runOperation(command, targetPath, content, fileName) {
  switch (command) {
    case "create":
      logger.log("[file-manager] Calling fs.writeFile asynchronously...");
      fs.writeFile(targetPath, content, "utf8", (error) => {
        reportResult(error, `Created "${fileName}".`, fileName);
      });
      break;
    case "read":
      logger.log("[file-manager] Calling fs.readFile asynchronously...");
      fs.readFile(targetPath, "utf8", (error, data) => {
        if (error) {
          reportResult(error, "", fileName);
          return;
        }

        logger.success(`[file-manager] Read complete. Content: ${data}`);
      });
      break;
    case "update":
      logger.log("[file-manager] Calling fs.appendFile asynchronously...");
      fs.appendFile(targetPath, content, "utf8", (error) => {
        reportResult(error, `Updated "${fileName}".`, fileName);
      });
      break;
    case "delete":
      logger.log("[file-manager] Calling fs.unlink asynchronously...");
      fs.unlink(targetPath, (error) => {
        reportResult(error, `Deleted "${fileName}".`, fileName);
      });
      break;
    default:
      throw new Error(`Unsupported command: ${command}`);
  }
}

function main() {
  const [commandInput, fileName, ...contentParts] = process.argv.slice(2);
  const command = commandInput?.toLowerCase();

  try {
    if (!validCommands.has(command)) {
      throw new Error("Choose create, read, update, or delete.");
    }

    if (!fileName) {
      throw new Error("A file name is required.");
    }

    if ((command === "create" || command === "update") && contentParts.length === 0) {
      throw new Error(`${command} requires content to write.`);
    }

    if ((command === "read" || command === "delete") && contentParts.length > 0) {
      throw new Error(`${command} does not accept content.`);
    }

    const targetPath = filePathFor(fileName);
    const content = contentParts.join(" ");

    logger.log(`[file-manager] Requested command: ${command}`);
    logger.log("[file-manager] Before scheduling the asynchronous file operation.");
    runOperation(command, targetPath, content, fileName);
    logger.log("[file-manager] After scheduling the asynchronous file operation.");
  } catch (error) {
    logger.error(`[file-manager] Input error: ${error.message}`);
    showUsage();
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { filePathFor };
