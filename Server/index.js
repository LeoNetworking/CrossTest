const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const directoryPath = '../Page';
const databaseFile = 'users.json';

// Serve the static files from the specified directory
app.use(express.static(directoryPath));

// Read the user data from the JSON file
function readUsersData() {
  try {
    const data = fs.readFileSync(databaseFile);
    if (data.length === 0) {
      return {}; // Return an empty object if the file is empty
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return {}; // Return an empty object if there's an error
  }
}

// Write the user data to the JSON file
function writeUsersData(users) {
  try {
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(databaseFile, data);
  } catch (error) {
    console.error('Error writing user data:', error);
  }
}

// Login function
function login(username, password) {
  const users = readUsersData();
  const storedPassword = users[username];

  if (!storedPassword || storedPassword !== password) {
    return false;
  }

  return true;
}

// Register function
function register(username, password) {
  const users = readUsersData();

  if (users[username]) {
    return false;
  }

  users[username] = password;

  writeUsersData(users);

  return true;
}

// Handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (login(username, password)) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Handle registration request
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (register(username, password)) {
    res.status(200).json({ message: 'Registration successful' });
  } else {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
