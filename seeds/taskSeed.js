import faker from 'faker';
import { Task } from '../models/index.js';
import { priority } from '../utils/utils.js';

const BoardIds = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];

const seedTask = async (numTasks) => {
    try {
        const fakeTasks = Array.from({ length: numTasks }, (_, i) => ({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            done: Math.floor(Math.random() * 2),
            starred: Math.floor(Math.random() * 2),
            due_date: faker.date.future(),
            priority: Object.values(priority)[Math.floor(Math.random() * Object.keys(priority).length)],
            BoardId: BoardIds[i % BoardIds.length],
        }));

        await Task.bulkCreate(fakeTasks);
        console.log(`********** SEED TASK ********** ${numTasks} tasks seeded successfully.`);
    } catch (error) {
        console.log('Error seeding tasks:', error.message);
    }
};

export default seedTask;
