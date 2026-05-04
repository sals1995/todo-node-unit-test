const express = require("express");
const todoRoutes = require("./routes/todo");
const userRoutes = require("./routes/user");
const todosModel = require("./models/todo");
const { connectToDatabase } = require("./db.connection");
require("dotenv").config();
const port = 3333;

const app = express();


app.use(express.json());

//handling routes
app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);

app.get("/", async function (_req, res) {
  const todos = await todosModel.find();
  res.status(200).json({ data: todos });
});

//error handling middleware
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

//not found middleware
app.use(function (_req, res, _next) {
  res.status(404).json({ message: "Not found" });
});

connectToDatabase()
  .then(() => {
    console.log("connected to DB");
    app.listen(port, () => {
      console.log(`server listening successfully http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports=app