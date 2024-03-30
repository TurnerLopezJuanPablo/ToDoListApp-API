import faker from 'faker';
import { Contributor } from '../models/index.js';

const seedUserTask = async (numUsersTask) => {
    try {
        const fakeUserTasks = Array.from({ length: numUsersTask }, () => ({
            userId: faker.datatype.number({ min: 2, max: 5 }),
            taskId: faker.datatype.number({ min: 1, max: 3 }),
        }));

        await UserTask.bulkCreate(fakeUserTasks);
        console.log(`*****SEED***** ${numUsersTask} usersTasks seeded successfully.`);
    } catch (error) {
        console.log('Error seeding usersTasks:', error.message);
    }
};

export default seedUserTask;
