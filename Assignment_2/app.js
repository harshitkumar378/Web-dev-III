const express = require("express");
const app = express();

const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

app.use(express.json());
app.use(logger);
app.get("/", (req, res) => {
  res.send("Student Management REST API is running");
});

app.use("/students", studentRoutes);

// ---------------------------------------------------
// 404 handler - runs if no route above matched
// ---------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ---------------------------------------------------
// Global error handler - catches any unexpected errors
// ---------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server"
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});