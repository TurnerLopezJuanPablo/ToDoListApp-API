import Task from "./task.js";
import Group from "./group.js";
import User from "./user.js";
import Category from "./category.js";
import Comment from "./comment.js";

// Task
Task.hasMany(Task, { as: 'subtasks', foreignKey: 'parentId' });
User.belongsToMany(Task, { through: 'UserTask' });
Task.belongsToMany(User, { through: 'UserTask' });

// Group
Group.hasMany(Task, { as: 'tasks' });

// User
User.hasMany(Task, { as: 'tasks' });
User.hasMany(Group, { as: 'groups' });

// Category
User.hasMany(Category, { as: 'categories' });
Category.belongsTo(User);

Category.hasMany(Task, { as: 'tasks' });
Task.belongsTo(Category);

// Comment
Comment.belongsTo(Task);
Comment.belongsTo(User);

export { Task, Group, User, Category, Comment };