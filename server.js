
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// GET route: Display registration form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST route: Validate student details
app.post("/register", (req, res) => {
    const { name, email, mobile, age, course } = req.body;

    const errors = [];

    // Server-side validation
    if (!name || !/^[a-zA-Z ]+$/.test(name.trim())) {
        errors.push("Name must contain only letters and spaces.");
    }

    if (
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        errors.push("Please enter a valid email address.");
    }

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
        errors.push("Mobile number must contain exactly 10 digits.");
    }

    const studentAge = Number(age);

    if (
        age === undefined ||
        String(age).trim() === "" ||
        !Number.isInteger(studentAge) ||
        studentAge < 16 ||
        studentAge > 60
    ) {
        errors.push("Age must be a whole number between 16 and 60.");
    }

    const validCourses = ["Computer Engineering", "IT", "AI & Data Science"];

    if (!validCourses.includes(course)) {
        errors.push("Please select a valid course.");
    }

    // Return errors if validation fails
    if (errors.length > 0) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Validation Errors</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <h1>Registration Failed</h1>
                    <div class="error">
                        <ul>
                            ${errors.map(error => `<li>${error}</li>`).join("")}
                        </ul>
                    </div>
                    <a class="button" href="/">Go Back to Form</a>
                </div>
            </body>
            </html>
        `);
    }

    // Success response
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Registration Successful</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Registration Successful!</h1>
                <div class="success">
                    Student registered successfully!
                </div>
                <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
                <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
                <p><strong>Mobile:</strong> ${escapeHtml(mobile)}</p>
                <p><strong>Age:</strong> ${studentAge}</p>
                <p><strong>Course:</strong> ${escapeHtml(course)}</p>
                <a class="button" href="/">Register Another Student</a>
            </div>
        </body>
        </html>
    `);
});

// Escape user input before inserting it into HTML
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
