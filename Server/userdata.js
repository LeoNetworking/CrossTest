const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const databaseFile = 'users.json';

// Read the user data from the JSON file
function readUsersData() {
  try {
    const data = fs.readFileSync(databaseFile);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return {};
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

  // Store the username and password in the users object
  users[username] = password;

  // Write the updated user data back to the JSON file
  writeUsersData(users);

  return true;
}

module.exports = { login, register };