const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/students", (req, res) => {
  fs.readFile(
    path.join(__dirname, "data", "students.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading students file:", err);
        return res.status(500).json({ error: "Could not read students data" });
      }

      const students = JSON.parse(data);

      const branch = req.query.branch;
      if (branch) {
        const filteredStudents = students.filter(
          (student) => student.branch === branch
        );
        return res.json(filteredStudents);
      }

      res.json(students);
    }
  );
});

app.get("/api/branches", (req, res) => {
  fs.readFile(
    path.join(__dirname, "data", "students.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading students file:", err);
        return res.status(500).json({ error: "Could not read students data" });
      }

      const students = JSON.parse(data);
      const branches = [...new Set(students.map((student) => student.branch))];

      res.json(branches);
    }
  );
});

app.delete("/api/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id);

  fs.readFile(
    path.join(__dirname, "data", "students.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading students file:", err);
        return res.status(500).json({ error: "Could not read students data" });
      }

      let students = JSON.parse(data);
      const studentIndex = students.findIndex(
        (student) => student.id === studentId
      );

      if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
      }

      students.splice(studentIndex, 1);

      fs.writeFile(
        path.join(__dirname, "data", "students.json"),
        JSON.stringify(students, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to students file:", err);
            return res
              .status(500)
              .json({ error: "Could not delete student data" });
          }

          res.json({ message: "Student deleted successfully" });
        }
      );
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
