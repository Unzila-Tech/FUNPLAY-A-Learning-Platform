const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const progressRoutes = require("./routes/progressRoutes");

const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");

dotenv.config();

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/questions", questionRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("FunPlay Backend is running");
});


// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Atlas connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });

  })
  .catch((error) => {

    console.log(
      "MongoDB connection error:",
      error.message
    );

  });