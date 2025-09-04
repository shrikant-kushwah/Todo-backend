// const express = require("express");
// const OpenAI = require("openai");

// const router = express.Router();

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post("/ai/create-todo", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     // Call OpenAI API
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "user", content: `Convert this into a todo task: ${prompt}` },
//       ],
//     });

//     const aiResponse = completion.choices[0].message.content;

//     // Construct a todo object (simple parsing)
//     const todo = {
//       title: aiResponse.split("\n")[0],
//       description: aiResponse,
//       deadline: "Tomorrow", // placeholder
//     };

//     res.json({ todo });
//   } catch (err) {
//     console.error("AI Todo Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = {router};
