const express = require("express");
const { Todo } = require("../Models/todoSchema");
const router = express.Router();
const { isLoggedIn } = require("../Middlewares/isLoggedIn");
const { isAuthor } = require("../Middlewares/isAuthor");

//Create Todo
router.post("/todos", isLoggedIn, async (req, res) => {
  try {
    const { title, desc, isCompleted } = req.body;

    //format date (YYYY/MM/DD)
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const date = `${year}/${month > 9 ? month : "0" + month}/${day > 9 ? day : "0" + day}`;

    //create new Todo in DB
    const createdTodo = await Todo.create({
      title,
      desc,
      isCompleted,
      date,
      updatedOn: date,
      author: req.userId
    });

    //push createdTodo into user's todos array
    req.user.todos.push(createdTodo._id);
    await req.user.save();

    res.status(201).json({ msg: "Todo created", data: createdTodo });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

//Get All Todos of Logged-In User
router.get("/todos", isLoggedIn, async (req, res) => {
  try {
    const allTodos = await Todo.find({ author: req.userId });
    res.status(200).json({ msg: "Done", data: allTodos });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

//Get Single Todo
router.get("/todos/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params;
    const foundTodo = await Todo.findById(id).select("title desc isCompleted");

    if (!foundTodo) {
      return res.status(404).json({ err: "Todo not found" });
    }

    res.status(200).json({ msg: "Done", data: foundTodo });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

//Delete Todo
router.delete("/todos/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ err: "Todo not found" });
    }

    res.status(200).json({ msg: "Todo deleted", data: deletedTodo });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

//Update Todo
router.patch("/todos/edit/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, isCompleted } = req.body;

    //format updated date
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const date = `${year}/${month > 9 ? month : "0" + month}/${day > 9 ? day : "0" + day}`;

    // update todo and return new version
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, desc, isCompleted, updatedOn: date },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ err: "Todo not found" });
    }

    res.status(200).json({ msg: "Todo updated", data: updatedTodo });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;













// const express = require("express");
// const { Todo } = require("../Models/todoSchema");
// const router = express.Router()
// const { isLoggedIn } = require("../Middlewares/isLoggedIn")
// const { isAuthor } = require("../Middlewares/isAuthor")



// router.post("/todos", isLoggedIn, async (req, res) => {
//   try {
//     const { title, desc, isCompleted } = req.body;
//     const d = new Date()
//     const day = d.getDate()
//     const month = d.getMonth() + 1
//     const year = d.getFullYear()
//     const date = `${year}/${month > 9 ? month : "0" + month}/${day > 9 ? day : "0" + day}`
//     // const date = `${year}/${month}/${day}`

//     // const createdTodo = new Todo({
//     //   title,
//     //   desc,
//     //   isCompleted,
//     //   date
//     // })

//     // await createdTodo.save()

//     // const createdTodo = await Todo.create({
//     //   title,desc,isCompleted, date
//     // })

//     const createdTodo = await Todo.create({
//       title, desc, isCompleted, date, updatedOn: date, author: req.userId
//     })
//     console.log(req.user)
//     req.user.todos.push(createdTodo._id)
//     await req.user.save()

//     res.status(201).json({ msg: "Done", data: createdTodo })
//   } catch (error) {
//     res.status(400).json({ err: error.message })
//   }
// })

// router.get("/todos", isLoggedIn, async (req, res) => {
//   try {
//     const allTodos = await Todo.find({ author: req.userId })
//     res.status(200).json({ msg: "Done", data: allTodos })
//   } catch (error) {
//     res.status(400).json({ err: error.message })
//   }
// })

// router.get("/todos/:id", isLoggedIn, isAuthor, async (req, res) => {
//   try {
//     const { id } = req.params
//     const foundTodo = await Todo.findById(id).select("title desc isCompleted")
//     if (!foundTodo) {
//       throw new Error("Invalid Id / Todo not found")
//     }
//     res.status(200).json({ msg: "done", data: foundTodo })
//   } catch (error) {
//     res.status(400).json({ err: error.message })
//   }
// })

// router.delete("/todos/:id", isLoggedIn, isAuthor, async (req, res) => {
//   try {
//     const { id } = req.params
//     const deleteTodo = await Todo.findByIdAndDelete(id)
//     res.status(200).json({ msg: "Done", deleteTodo })
//   } catch (error) {
//     res.status(400).json({ err: error.message })
//   }
// })

// router.patch("/todos/edit/:id", isLoggedIn, isAuthor, async (req, res) => {
//   try {
//     const { id } = req.params
//     const { title, desc, isCompleted } = req.body;
//     const d = new Date()
//     const day = d.getDate()
//     const month = d.getMonth() + 1
//     const year = d.getFullYear()
//     const date = `${year}/${month > 9 ? month : "0" + month}/${day > 9 ? day : "0" + day}`
//     const updatedTodo = await Todo.findByIdAndUpdate(id, { title, desc, isCompleted, updatedOn: date }, { returnDocument: "after" })
//     res.status(200).json({ msg: "Done", data: updatedTodo })
//   } catch (error) {
//     res.status(400).json({ err: error.message })
//   }
// })







// module.exports = router