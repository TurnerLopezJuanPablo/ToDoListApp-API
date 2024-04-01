import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import bcrypt from "bcrypt";

class User extends Model {
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isUsernameValid(value) {
                if (value.length > 30) {
                    throw new Error('Username must have a maximum of 30 characters');
                }
            },
        },

    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isNameValid(value) {
                const regex = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/;
                const isValid = regex.test(value);
                if (!isValid) {
                    throw new Error('Name must only contain letters and spaces');
                }
                if (value.length > 30) {
                    throw new Error('Name must have a maximum of 30 characters');
                }
            },
        },
    },
    surname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isSurNameValid(value) {
                const regex = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/;
                const isValid = regex.test(value);
                if (!isValid) {
                    throw new Error('Surname must only contain letters and spaces');
                }
                if (value.length > 30) {
                    throw new Error('Surname must have a maximum of 30 characters');
                }
            },
        },
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
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: {
            msg: "The entered email is already registered"
        },
        validate: {
            isEmail: {
                msg: "Incorrect email format"
            },
            isEmailValid(value) {
                const validateMail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                const isValid = validateMail.test(value);
                if (!isValid) {
                    throw new Error('Invalid Email Format');
                }
                if (value.length > 40) {
                    throw new Error('Email must have a maximum of 40 characters');
                }
            }
        },
    },
    emailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING()
    },
    oldUserName: {
        type: DataTypes.STRING(30),
        allowNull: true,
        validate: {
            isUsernameValid(value) {
                if (value && value.length > 30) {
                    throw new Error('Username must have a maximum of 30 characters');
                }
            },
        },
    },
    lastUserNameUpdated: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "Invalid Date Format"
            },
        }
    },
    activeUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    sequelize: connection,
    modelName: "User",
    timestamps: false
});

const trimFields = (instance) => {
    if (instance.userName) instance.userName = instance.userName.trim();
    if (instance.name) instance.name = instance.name.trim();
    if (instance.surname) instance.surname = instance.surname.trim();
};

User.beforeUpdate(async (user) => {
    trimFields(user);

    const newPasswordHash = await bcrypt.hash(user.password, user.salt);
    user.password = newPasswordHash
});

User.beforeCreate(async (user) => {
    trimFields(user);

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