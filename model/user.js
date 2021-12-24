const mongoose = require('mongoose');

const User = new mongoose.Schema({
    id: String,
    todoList: [String],
    state: String,
    lastActive: String,
});

module.exports = mongoose.model("users", User);