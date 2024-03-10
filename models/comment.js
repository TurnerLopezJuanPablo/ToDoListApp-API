const { DataTypes, Sequelize } = require('sequelize');
import connection from "../connection/connection.js";

class Comment extends Model { }

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    sequelize: connection,
    modelName: "Comment",
    timestamps: false
});

export default Comment;
