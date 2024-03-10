const { DataTypes, Sequelize } = require('sequelize');
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
