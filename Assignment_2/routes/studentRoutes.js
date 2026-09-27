const express = require("express");
const router = express.Router();
const students = require("../data/students");

// ---------------------------------------------------
// GET /students  -> get ALL students
// ---------------------------------------------------
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// ---------------------------------------------------
// GET /students/:id  -> get ONE student by id
// ---------------------------------------------------
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// ---------------------------------------------------
// POST /students  -> create a NEW student
// ---------------------------------------------------
router.post("/", (req, res) => {
  const { name, course } = req.body;

  // Basic validation -> 400 Bad Request if missing data
  if (!name || !course) {
    return res.status(400).json({
      success: false,
      message: "Please provide both name and course"
    });
  }

  const newStudent = {
    id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
    name: name,
    course: course
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: newStudent
  });
});

// ---------------------------------------------------
// PUT /students/:id  -> update an EXISTING student
// ---------------------------------------------------
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  const { name, course } = req.body;

  if (!name || !course) {
    return res.status(400).json({
      success: false,
      message: "Please provide both name and course"
    });
  }

  student.name = name;
  student.course = course;

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student
  });
});

// ---------------------------------------------------
// DELETE /students/:id  -> delete a student
// ---------------------------------------------------
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  const deletedStudent = students[index];
  students.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: deletedStudent
  });
});

module.exports = router;