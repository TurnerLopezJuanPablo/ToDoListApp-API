import faker from 'faker';
import { SubTask } from '../models/index.js';

const seedSubTask = async (numSubTasks) => {
    try {
        const fakeSubTasks = Array.from({ length: numSubTasks }, () => ({
            text: faker.commerce.productDescription(),
            done: Math.floor(Math.random() * 2),
            TaskId: Math.floor(Math.random() * 5) + 1,
        }));

        await SubTask.bulkCreate(fakeSubTasks);
        console.log(`********** SEED SUBTASK ********** ${numSubTasks} subTasks seeded successfully.`);
    } catch (error) {
        console.log('Error seeding subTasks:', error.message);
    }
};

export default seedSubTask;