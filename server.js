const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"] 
}));
db();
const PORT = 3000;

app.use("/api/auth", require("./routes/auth"));
app.use("/api/children", require("./routes/user"));
app.use("/api/progress", require("./routes/user"));
app.use("/api/order", require("./routes/order"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/ai", require("./AI"));



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});