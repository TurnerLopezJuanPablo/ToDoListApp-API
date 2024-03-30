import faker from 'faker';
import { Board } from '../models/index.js';

const seedBoard = async (numBoards) => {
    try {
        const fakeBoards = Array.from({ length: numBoards }, () => ({
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            UserId: 1
        }));

        await Board.bulkCreate(fakeBoards);
        console.log(`*****SEED***** ${numBoards} groups seeded successfully.`);
    } catch (error) {
        console.log('Error seeding groups:', error.message);
    }
};

export default seedBoard;
