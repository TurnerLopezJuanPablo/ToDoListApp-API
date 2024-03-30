import Task from "./task.js";
import Board from "./board.js";
import User from "./user.js";
import Category from "./category.js";
import Comment from "./comment.js";
import Contributor from "./contributor.js";
import SubTask from "./subTask.js"

// Contributor
Board.belongsToMany(User, { through: Contributor })
User.belongsToMany(Board, { through: Contributor });

// User
User.hasMany(Comment);

// Comment
Comment.belongsTo(User);

// Board
Board.hasMany(Category);
Board.hasMany(Task);

// Category
Category.belongsTo(Board);

// Task
Task.hasMany(Comment);
Task.hasMany(SubTask);
Task.belongsTo(Category);

export { Task, Board, User, Category, Comment, Contributor, SubTask };