import faker from 'faker';
import { SubTask } from '../models/index.js';

const TaskIds = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];

const seedSubTask = async (numSubTasks) => {
    try {
        const fakeSubTasks = Array.from({ length: numSubTasks }, (_, i) => ({
            text: faker.commerce.productDescription(),
            done: Math.floor(Math.random() * 2),
            TaskId: TaskIds[i % TaskIds.length],
        }));

        await SubTask.bulkCreate(fakeSubTasks);
        console.log(`********** SEED SUBTASK ********** ${numSubTasks} subTasks seeded successfully.`);
    } catch (error) {
        console.log('Error seeding subTasks:', error.message);
    }
};

export default seedSubTask;