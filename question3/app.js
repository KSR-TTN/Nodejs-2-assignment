const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const addCreatedOnDateMiddleware = (req, res, next) => {
  if (req.body) {
    req.body.created_on = new Date().toISOString();
  }
  next();
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/add-user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add-user.html"));
});

app.get("/api/users", (req, res) => {
  fs.readFile(
    path.join(__dirname, "data", "users.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading users file:", err);
        return res.status(500).json({ error: "Could not read users data" });
      }

      const users = JSON.parse(data);
      res.json(users);
    }
  );
});

app.post("/api/users", addCreatedOnDateMiddleware, (req, res) => {
  fs.readFile(
    path.join(__dirname, "data", "users.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading users file:", err);
        return res.status(500).json({ error: "Could not read users data" });
      }

      const users = JSON.parse(data);
      const newUser = {
        id:
          users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
        name: req.body.name,
        email: req.body.email,
        created_on: req.body.created_on,
      };

      users.push(newUser);

      fs.writeFile(
        path.join(__dirname, "data", "users.json"),
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to users file:", err);
            return res.status(500).json({ error: "Could not write user data" });
          }

          res.status(201).json(newUser);
        }
      );
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  fs.readFile(
    path.join(__dirname, "data", "users.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading users file:", err);
        return res.status(500).json({ error: "Could not read users data" });
      }

      let users = JSON.parse(data);
      const userIndex = users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      users.splice(userIndex, 1);

      fs.writeFile(
        path.join(__dirname, "data", "users.json"),
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to users file:", err);
            return res
              .status(500)
              .json({ error: "Could not delete user data" });
          }

          res.json({ message: "User deleted successfully" });
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
