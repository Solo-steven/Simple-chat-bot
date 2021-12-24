const mongoose = require('mongoose');

const User = new mongoose.Schema({
    id: String,
    todoList: [String],
    state: String,
    lastActive: String,
    updateIndex: Number
});

module.exports = mongoose.model("users", User);