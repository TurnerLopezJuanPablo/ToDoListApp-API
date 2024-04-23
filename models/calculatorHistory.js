import { DataTypes, Model } from 'sequelize';
import connection from "../connection/connection.js";

class CalculatorHistory extends Model { }

CalculatorHistory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstOperand: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'FirstOperand is required',
            },
            customLength(value) {
                if (value.length > 15) {
                    throw new Error('FirstOperand must have a maximum of 15 characters');
                }
            },
        },
    },
    operator: {
        type: DataTypes.CHAR(1),
        validate: {
            isValidOperator(value) {
                if (!['+', '-', '*', 'x', '/'].includes(value)) {
                    throw new Error('Operator must be one of the following: +, -, *, /');
                }
            }
        }
    },
    secondOperand: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'SecondOperand is required',
            },
            customLength(value) {
                if (value.length > 15) {
                    throw new Error('SecondOperand must have a maximum of 15 characters');
                }
            },
        },
    },
    result: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Result is required',
            },
            customLength(value) {
                if (value.length > 15) {
                    throw new Error('Result must have a maximum of 25 characters');
                }
            },
        },
    },
}, {
    sequelize: connection,
    modelName: "CalculatorHistory",
    timestamps: false
});

export default CalculatorHistory;