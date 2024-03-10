import Task from "./task";
import Group from "./group";
import User from "./user";
import Category from "./category";
import Comment from "./comment";

// Task
Task.hasMany(Task, { as: 'subtasks', foreignKey: 'parentId' });
User.belongsToMany(Task, { through: 'UserTask' });
Task.belongsToMany(User, { through: 'UserTask' });

// Group
TaskGroup.hasMany(Task, { as: 'tasks' });

// User
User.hasMany(Task, { as: 'tasks' });
User.hasMany(TaskGroup, { as: 'taskGroups' });

// Category
User.hasMany(Category, { as: 'categories' });
Category.belongsTo(User);

Category.hasMany(Task, { as: 'tasks' });
Task.belongsTo(Category);

// Comment
Comment.belongsTo(Task);
Comment.belongsTo(User);

export { Task, Group, User, Category, Comment };