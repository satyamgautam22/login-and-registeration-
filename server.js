const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Path to the user data (users.json file)
const usersDb = './data/users.json';

// Helper functions to load and save users
function loadUsers() {
  if (!fs.existsSync(usersDb)) return [];
  const data = fs.readFileSync(usersDb);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(usersDb, JSON.stringify(users, null, 2));
}

// Serve the registration page as the default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the user dashboard after successful login
// Serve the user dashboard after successful login
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Registration logic
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers(); // Load existing users from the users.json file

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  // Hash the password and save the new user
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  saveUsers(users);  // Save the updated users list to users.json

  res.json({ message: 'User registered successfully!' });
});

// Login logic
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Redirect to dashboard on successful login
  res.redirect('/dashboard');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
