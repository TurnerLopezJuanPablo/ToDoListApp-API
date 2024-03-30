import Task from "./task.js";
import Board from "./board.js";
import User from "./user.js";
import Category from "./category.js";
import Comment from "./comment.js";
import Contributor from "./contributor.js";
import SubTask from "./subTask.js"

// Contributor
Board.belongsToMany(User, { as: "Contributors", through: Contributor, allowNull: false })
User.belongsToMany(Board, { as: "Contributors", through: Contributor, allowNull: false });

// User
User.hasMany(Comment, { as: "Tasks", foreignKey: { allowNull: false } });

// Comment
Comment.belongsTo(User, { foreignKey: { allowNull: false } });

// Board
Board.hasMany(Category, { as: "Categories", foreignKey: { allowNull: false } });
Board.hasMany(Task, { as: "Tasks", foreignKey: { allowNull: false } });

// Category
Category.belongsTo(Board, { foreignKey: { allowNull: false } });

// Task
Task.hasMany(Comment, { as: "Comments", foreignKey: { allowNull: false } });
Task.hasMany(SubTask, { as: "SubTasks", foreignKey: { allowNull: false } });
Task.belongsTo(Category);

export { Task, Board, User, Category, Comment, Contributor, SubTask };