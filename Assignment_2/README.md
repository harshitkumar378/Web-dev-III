# Student Management REST API
Lab Assignment 2 — Web Dev III (Unit 2)

A simple REST API built with Node.js and Express.js to manage student records
(Create, Read, Update, Delete). No database — data is stored in a plain
JavaScript array in memory, as required by the assignment.

## Project Structure
```
student-management-api/
├── app.js                 -> Main server file
├── routes/
│   └── studentRoutes.js   -> All 5 CRUD routes
├── middleware/
│   └── logger.js          -> Custom logger middleware
├── data/
│   └── students.js        -> In-memory array (our "database")
└── package.json
```

## How to Run
1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```
3. Server runs at: `http://localhost:3000`

## API Endpoints

| Method | Endpoint          | Description         | Success Code | Error Code |
|--------|-------------------|----------------------|---------------|------------|
| GET    | /students         | Get all students     | 200           | -          |
| GET    | /students/:id     | Get one student      | 200           | 404        |
| POST   | /students         | Add new student       | 201           | 400        |
| PUT    | /students/:id     | Update a student      | 200           | 400 / 404  |
| DELETE | /students/:id     | Delete a student      | 200           | 404        |

## Testing in Postman

**GET all students**
`GET http://localhost:3000/students`

**GET one student**
`GET http://localhost:3000/students/1`

**POST — create student** (Body → raw → JSON)
`POST http://localhost:3000/students`
```json
{
  "name": "Sneha",
  "course": "BCA"
}
```

**PUT — update student** (Body → raw → JSON)
`PUT http://localhost:3000/students/1`
```json
{
  "name": "Rahul Sharma",
  "course": "BCA"
}
```

**DELETE — remove student**
`DELETE http://localhost:3000/students/1`

> Note: in POST and PUT, remember to set the header
> `Content-Type: application/json` in Postman, and select Body → raw → JSON.

## How to Explain This in Your Viva (simple points)

1. **app.js** — this is the starting point. It creates the Express server,
   turns on JSON parsing (`express.json()`), applies the logger middleware
   to every request, and mounts all `/students` routes from `studentRoutes.js`.
   It also has a 404 handler (for routes that don't exist) and a generic
   error handler at the bottom.

2. **middleware/logger.js** — a middleware is just a function that runs
   *before* your route handler. This one prints the request method, URL,
   and the current time to the console every time a request comes in, then
   calls `next()` to let the request continue.

3. **routes/studentRoutes.js** — uses `express.Router()` for **modular
   routing** (keeping routes in a separate file instead of writing
   everything in app.js). It has the 5 CRUD routes:
   - `GET /` → returns all students
   - `GET /:id` → finds one student using `Array.find()`
   - `POST /` → validates input, then adds a new student with `Array.push()`
   - `PUT /:id` → finds the student and overwrites its fields
   - `DELETE /:id` → finds the index with `Array.findIndex()` and removes it
     with `Array.splice()`

4. **data/students.js** — just an array of objects acting as our
   "database". No MongoDB/MySQL used, exactly as required.

5. **Error handling** — every route checks if the student exists /
   input is valid, and returns the right status code (400 for bad input,
   404 for not found) instead of crashing.

## Submission Checklist
- [x] Express server created
- [x] All 5 CRUD APIs implemented
- [x] Custom logger middleware
- [x] Modular routing (routes/ folder + express.Router())
- [x] Proper status codes (200, 201, 400, 404)
- [x] Tested in Postman
- [ ] Push to GitHub and submit the link
