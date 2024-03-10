import { DataTypes as DT, Model } from "sequelize";
import connection from "../connection/connection.js";
import bcrypt from "bcrypt";

class User extends Model { }

User.init({
    id: {
        type: DT.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DT.STRING,
        allowNull: false,
        validate: {
            isUsernameValid(value) {
                const regex = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/;
                const isValid = regex.test(value);
                if (!isValid) {
                    throw new Error('Username must only contain letters and spaces');
                }
                if (value.length > 30) {
                    throw new Error('Username must have a maximum of 30 characters');
                }
            },
        },
    },
    surname: {
        type: DT.STRING,
        allowNull: false,
        validate: {
            isUsernameValid(value) {
                const regex = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/;
                const isValid = regex.test(value);
                if (!isValid) {
                    throw new Error('Surname must only contain letters and spaces');
                }
                if (value.length > 30) {
                    throw new Error('Surname must have a maximum of 30 characters');
                }
            }
        }
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "Invalid Date Format"
            },
            isBeforeToday: function (value) {
                if (new Date(value) >= new Date()) {
                    throw new Error('The date must be before today.');
                }
            },
        }
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: "The entered email is already registered"
        },
        validate: {
            isEmail: {
                msg: "Incorrect email format"
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING()
    },
}, {
    sequelize: connection,
    modelName: "User",
    timestamps: false
});

User.beforeUpdate(async (user) => {
    const newPasswordHash = await bcrypt.hash(user.password, user.salt);
    user.password = newPasswordHash
});

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    const passwordHash = await bcrypt.hash(user.password, salt);
    user.password = passwordHash;
});

User.beforeBulkCreate(async (users) => {

    for (let index = 0; index < users.length; index++) {
        const user = users[index];

        const salt = await bcrypt.genSalt();
        user.salt = salt;

        const claveHash = await bcrypt.hash(user.password, salt);
        user.password = claveHash;
    };
});

export default User;