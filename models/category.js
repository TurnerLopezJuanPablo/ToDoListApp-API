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
        allowNull: false
    },
}, {
    sequelize: connection,
    modelName: "Category",
    timestamps: false
});

export default Category;
