import { DataTypes, Model } from 'sequelize';
import connection from "../connection/connection.js";

class Group extends Model { }

Group.init({
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
                msg: 'Group Title is required',
            },
            customLength(value) {
                if (value.length > 50) {
                    throw new Error('Group Title must have a maximum of 50 characters');
                }
            },
        },
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize: connection,
    modelName: "Group",
    timestamps: false
});

Group.beforeCreate(async (group, options) => {
    const desiredName = group.title;

    let newName = desiredName;
    let count = 1;

    while (await Group.findOne({ where: { title: newName } })) {
        newName = `${desiredName} (${count})`;
        count++;
    }

    group.title = newName;
});

Group.beforeUpdate(async (group, options) => {
    const desiredName = group.title;

    let newName = desiredName;
    let count = 1;

    while (await Group.findOne({ where: { title: newName } })) {
        newName = `${desiredName} (${count})`;
        count++;
    }

    group.title = newName;
});

export default Group;
