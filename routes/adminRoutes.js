const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome to Dashboard", user: req.user });
  }
);

router.get(
  "/staff",
  // authMiddleware,
  // roleMiddleware("admin"),
  async (req, res) => {
    try {
      const staff = await User.find();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
    //res.json({ message: "Welcome to Staff Dashboard", user: req.user });
    //   // Create a route to fetch todos
    // app.get('/api/todos', async (req, res) => {
    //   const todos = await Todo.find().sort({ createdAt: -1 });
    //   res.json(todos)
    // //client code
    //     async fetchTodos() {
    //       try {
    //         const response = await axios.get('http://localhost:3000/api/todos');
    //         this.todos = response.data;
    //       } catch (error) {
    //         console.error('Error fetching todos:', error);
    //       }
    //     }
    // <ul>
    //   <li v-for="todo in todos" :key="todo._id">{{ todo.title }}</li>
    // </ul>
  }
);
router.get("/items", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome to Items Dashboard", user: req.user });
});
router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome to Customers Dashboard", user: req.user });
  }
);

module.exports = router;
