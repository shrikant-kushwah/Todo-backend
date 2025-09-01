const express = require("express");
const { Todo } = require("../Models/todoSchema");
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { isAuthor } = require("../Middlewares/isAuthor")



router.post("/todos", isLoggedIn, async (req, res) => {
  try {
    const { title, desc, isCompleted } = req.body;
    const d = new Date()
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const date = `${year}/${month > 9 ? month : "0" + month}/${day > 9 ? day : "0" + day}`
    // const date = `${year}/${month}/${day}`

    // const createdTodo = new Todo({
    //   title,
    //   desc,
    //   isCompleted,
    //   date
    // })

    // await createdTodo.save()

    // const createdTodo = await Todo.create({
    //   title,desc,isCompleted, date
    // })

    const createdTodo = await Todo.insertOne({
      title, desc, isCompleted, date, updatedOn: date, author: req.userId
    })
    console.log(req.user)
    req.user.todos.push(createdTodo._id)
    await req.user.save()

    res.json({ msg: "Done", data: createdTodo })
  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})

router.get("/todos", isLoggedIn, async (req, res) => {
  try {
    const allTodos = await Todo.find({ author: req.userId })
    res.status(200).json({ msg: "Done", data: allTodos })
  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})

router.get("/todos/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params
    const foundTodo = await Todo.findById(id).select("title desc isCompleted")
    if (!foundTodo) {
      throw new Error("Invalid Id / Todo not found")
    }
    res.status(200).json({ msg: "done", data: foundTodo })
  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})

router.delete("/todos/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params
    const deleteTodo = await Todo.findByIdAndDelete(id)
    res.status(200).json({ msg: "Done", deleteTodo })
  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})

router.patch("/todos/edit/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params
    const { title, desc, isCompleted } = req.body;
    const d = new Date()
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const date = `${year}/${month > 9 ? month : "0" + month}/${day > 9 ? day : "0" + day}`
    const updatedTodo = await Todo.findByIdAndUpdate(id, { title, desc, isCompleted, updatedOn: date }, { returnDocument: "after" })
    res.status(200).json({ msg: "Done", data: updatedTodo })
  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})







module.exports = router