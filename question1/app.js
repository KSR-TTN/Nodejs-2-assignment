const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const USERS_FILE = path.join(__dirname, "data", "users.json");

app.get("/api/users", async (req, res) => {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error reading users data" });
  }
});

app.get("/api/users/search", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }

    const data = await fs.readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);

    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(username.toLowerCase())
    );

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Error searching users" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const data = await fs.readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      firstName,
      lastName,
    };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
