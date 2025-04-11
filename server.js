const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 3019;
const app = express();

// Middleware to serve static files
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json()); // Parses JSON data

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connection successful"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema & Model
const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    branch: String
});

const User = mongoose.model("User", userSchema); // Collection name will be "users" in MongoDB

// Route: Serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Route: Handle form submission
app.post('/post', async (req, res) => {
    try {
        const { regd_no, name, email, branch } = req.body;

        if (!regd_no || !name || !email || !branch) {
            return res.status(400).send("❌ All fields are required!");
        }

        const newUser = new User({ regd_no, name, email, branch });
        await newUser.save();

        console.log("✅ Saved User:", newUser);
        res.send("🎉 Form Submission Successful!");
    } catch (err) {
        console.error("❌ Error saving data:", err);
        res.status(500).send("⚠ Internal Server Error");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
});
