import { DataTypes, Model } from 'sequelize'; 
import sequelize from '../connection/connection.js';
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
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    sequelize: connection,
    modelName: "Comment",
    timestamps: false
});

export default Comment;
