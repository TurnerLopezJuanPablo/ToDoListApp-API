import faker from 'faker';
import { Board } from '../models/index.js';

const seedBoard = async (numBoards) => {
    try {
        const fakeBoards = Array.from({ length: numBoards }, () => ({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
        }));

        await Board.bulkCreate(fakeBoards);
        console.log(`********** SEED BOARD ********** ${numBoards} boards seeded successfully.`);
    } catch (error) {
        console.log('Error seeding boards:', error.message);
    }
};

export default seedBoard;
