# Smart Utility Toolkit

Web Dev III Assignment 1, implemented only with Node.js core modules. No external npm packages, frameworks, or databases are used. ANSI colors improve terminal readability, and timestamp logs show program flow.

## project structure

```text
Assignment_1/
├── calculator.js
├── app.js
├── server.js
├── fileManager.js
├── dice.js
├── test.txt
├── modules/
│   ├── isEven.js
│   └── logger.js
├── package.json
└── README.md
```

Keep the terminal open in this `Assignment_1` folder. Node.js 18 or later is required.

## Run the programs

```powershell
# Calculator using process.argv
node calculator.js add 10 5
node calculator.js divide 10 5
node calculator.js modulus 10 3
node calculator.js power 2 8
node calculator.js average 10 20

# Custom modules: isEven.js and logger.js
node app.js 12
node app.js 7

# HTTP server (visit http://localhost:3000, /about, /contact, or an invalid route)
npm run server

# File manager using the included test.txt file
node fileManager.js read test.txt
node fileManager.js update test.txt " Added text"
node fileManager.js create practice.txt "First line"
node fileManager.js delete practice.txt

# Secure random dice rolls
node dice.js
node dice.js 5
```

`fileManager.js` uses asynchronous `writeFile`, `readFile`, `appendFile`, and `unlink`. Its logs show the order in which the program schedules and completes each operation. Every dice run appends a timestamped result to `test.txt`. Stop the server with `Ctrl+C`.
