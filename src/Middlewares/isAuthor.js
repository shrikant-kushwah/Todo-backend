const { Todo } = require("../Models/todoSchema")

async function isAuthor(req, res, next) {
  try {
    const { id } = req.params;

    //Find the Todo by ID
    const foundTodo = await Todo.findById(id);

    //Edge case: if Todo not found
    if (!foundTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    //Check if the current user is the author
    if (!foundTodo.author.equals(req.userId)) {
      throw new Error("Permission Denied");
    }

    //If everything is fine => move to the next middleware
    next();

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { isAuthor };