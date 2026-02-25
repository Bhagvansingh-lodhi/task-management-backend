import Task from "../models/Task.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export const createTask = async (req, res) => {
  const { title, description } = req.body;

  const encryptedDescription = encrypt(description);

  const task = await Task.create({
    title,
    description: encryptedDescription,
    user: req.user._id
  });

  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const { page = 1, limit = 5, status, search } = req.query;

  let query = { user: req.user._id };

  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: "i" };

  const tasks = await Task.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const decryptedTasks = tasks.map(task => ({
    ...task._doc,
    description: decrypt(task.description)
  }));

  res.json(decryptedTasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = req.body.title || task.title;
  task.status = req.body.status || task.status;

  if (req.body.description) {
    task.description = encrypt(req.body.description);
  }

  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};