import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection/connection.js';
import connection from "../connection/connection.js";

class Category extends Model { }

Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Title is required',
            },
            customLength(value) {
                if (value.length > 50) {
                    throw new Error('Title must have a maximum of 50 characters');
                }
            },
        },
    },
}, {
    sequelize: connection,
    modelName: "Category",
    timestamps: false
});

Category.beforeCreate(async (category, options) => {
    const desiredName = category.title;

    let newName = desiredName;
    let count = 1;

    while (await Category.findOne({ where: { title: newName } })) {
        newName = `${desiredName} (${count})`;
        count++;
    }

    category.title = newName;
});

Category.beforeUpdate(async (category, options) => {
    const desiredName = category.title;

    let newName = desiredName;
    let count = 1;

    while (await Category.findOne({ where: { title: newName } })) {
        newName = `${desiredName} (${count})`;
        count++;
    }

    category.title = newName;
});

export default Category;
