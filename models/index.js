import Task from "./task.js";
import Group from "./group.js";
import User from "./user.js";
import Category from "./category.js";
import Comment from "./comment.js";
import UserTask from "./userTask.js";

// Task
Task.hasMany(Task, { as: 'subtasks', foreignKey: 'parentId' });

// UserTask
Task.belongsToMany(User, {
    as: 'UserTasks',
    through: "UserTask",
    foreignKey: "taskId",
})

User.belongsToMany(Task, {
    as: 'UserTasks',
    through: "UserTask",
    foreignKey: "userId",
})

// Group
Group.hasMany(Task, { as: 'tasks' });

// User
User.hasMany(Task, { as: 'tasks' });
User.hasMany(Group, { as: 'groups' });

// Category
Category.belongsTo(User);
User.hasMany(Category, { as: 'categories' });

Category.hasMany(Task, { as: 'tasks' });
Task.belongsTo(Category);

// Comment
Task.hasMany(Comment, { as: 'comments' });
Comment.belongsTo(Task);

Comment.belongsTo(User);
User.hasMany(Comment, { as: 'comments' });

export { Task, Group, User, Category, Comment, UserTask };