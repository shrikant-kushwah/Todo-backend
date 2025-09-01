const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const validator = require("validator")


const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 2
  },
  desc: {
    type: String,
    required: true,
    trim: true,
    minLength: 2
  },
  isCompleted: {
    type: Boolean,
    required: true
  },
  date: {
    type: String,
    validator(val) {
      const flag = validator.isDate(val)
      if (!flag) {
        throw new Error("Please enter a valid date")
      }
    }
  },
  updatedOn: {
    type: String,
    validator(val) {
      const flag = validator.isDate(val)
      if (!flag) {
        throw new Error("Please enter a valid date")
      }
    }
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  }
}, { timestamps: true })


const Todo = mongoose.model("Todo", todoSchema)
module.exports = { Todo }