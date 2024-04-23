import { CalculatorHistory } from "../models/index.js";

class CalculatorHistoryController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const { user } = req;
            const result = await CalculatorHistory.findAll({
                attributes: [
                    "id",
                    "firstOperand",
                    "operator",
                    "secondOperand",
                    "result",
                ],
                where: [
                    { UserId: user.idUser }
                ]
            })
            if (!result || result.length === 0) {
                const error = new Error("No calculatorHistories found associated to your User");
                error.status = 404;
                throw error;
            }
            res.status(200).send({ success: true, message: "CalculatorHistories:", result });
        } catch (error) {
            next(error);
        }
    };

    createCalculatorHistory = async (req, res, next) => {
        try {
            const { firstOperand, operator, secondOperand, result } = req.body;
            const { user } = req;

            await this.checkResult(firstOperand, operator, secondOperand, result);

            const history = await CalculatorHistory.create({
                firstOperand,
                operator,
                secondOperand,
                result,
                UserId: user.idUser,
            });
            if (!history) throw new Error("Failed to create the calculatorHistory");
            res
                .status(200)
                .send({ success: true, message: "CalculatorHistory created successfully" });
        } catch (error) {
            next(error);
        }
    };

    deleteCalculatorHistory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { user } = req;

            const result = await CalculatorHistory.destroy({
                where: { id: id, UserId: user.idUser },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "CalculatorHistory deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "CalculatorHistory not found with id: " + id + " and associated to your User",
                });
            }
        } catch (error) {
            next(error);
        }
    };

    deleteAll = async (req, res, next) => {
        try {
            const { user } = req;
            const result = await CalculatorHistory.destroy({
                where: { UserId: user.idUser },
            });

            if (result >= 1) {
                res.status(200).send({
                    success: true,
                    message: "All CalculatorHistory related to your User deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "No CalculatorHistories detected related to your User",
                });
            }
        } catch (error) {
            next(error);
        }
    };

    checkResult = async (firstOperand, operator, secondOperand, result) => {
        if (!['+', '-', '*', 'x', '/'].includes(operator)) {
            const error = new Error('Operator must be one of the following: +, -, *, /');
            error.status = 400;
            throw error;
        }

        let calculatedResult = 0;

        switch (operator) {
            case '+':
                calculatedResult = parseFloat(firstOperand) + parseFloat(secondOperand);
                break;
            case '-':
                calculatedResult = parseFloat(firstOperand) - parseFloat(secondOperand);
                break;
            case 'x':
            case '*':
                calculatedResult = parseFloat(firstOperand) * parseFloat(secondOperand);
                break;
            case '/':
                calculatedResult = parseFloat(firstOperand) / parseFloat(secondOperand);
                break;
        }

        if (parseFloat(result) !== calculatedResult) {
            const error = new Error(`Result mismatch. Expected ${result}, but got ${calculatedResult}.`);
            error.status = 403;
            throw error;
        }

        return true;
    };
}

export default CalculatorHistoryController;