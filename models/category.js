import { DataTypes, Model } from 'sequelize';
import connection from "../connection/connection.js";
import { generateUniqueTitle } from '../utils/utils.js';

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
    category.title = await generateUniqueTitle(category.title, Category);
});

Category.beforeUpdate(async (category, options) => {
    category.title = await generateUniqueTitle(category.title, Category);
});

export default Category;
