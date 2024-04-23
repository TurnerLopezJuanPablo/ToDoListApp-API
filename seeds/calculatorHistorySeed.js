import { CalculatorHistory } from '../models/index.js';

const seedCalculatorHistory = async (numHistory) => {
    try {
        const fakeHistories = Array.from({ length: numHistory }, (_, i) => {
            const firstOperand = Math.floor(Math.random() * 201) - 100; 
            const secondOperand = Math.floor(Math.random() * 201) - 100; 
        
            const operators = ['+', '-', '*', 'x', '/'];
            const operator = operators[Math.floor(Math.random() * operators.length)];
        
            let result;
            switch (operator) {
                case '+':
                    result = firstOperand + secondOperand;
                    break;
                case '-':
                    result = firstOperand - secondOperand;
                    break;
                case '*':
                case 'x':
                    result = firstOperand * secondOperand;
                    break;
                case '/':
                    result = firstOperand / secondOperand;
                    break;
            }
        
            return {
                firstOperand,
                operator,
                secondOperand,
                result,
                UserId: 1
            };
        });
        
        await CalculatorHistory.bulkCreate(fakeHistories);
        console.log(`********** SEED CALCULATOR HISTORY ********** ${numHistory} calculator histories seeded successfully.`);
    } catch (error) {
        console.log('Error seeding calculator histories:', error.message);
    }
}

export default seedCalculatorHistory;