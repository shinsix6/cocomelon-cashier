const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const { error } = require("console");

dotenv.config();

// create server express
const app = express();

app.use(cors());

// to read json in request body
app.use(express.json());

// to access image with url in uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// run the checkhealth for "/"
app.get("/", (req, res) => {
  res.json({
    message: "Cocomelon backend is running"
  })
});

// place the middleware
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/transaction", transactionRoutes);

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  })

