import faker from 'faker';
import { Task } from '../models/index.js';

const seedTask = async (numTasks) => {
    try {
        const fakeTasks = Array.from({ length: numTasks }, () => ({
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            due_date: faker.date.future(),
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            GroupId: faker.datatype.number({ min: 1, max: 3}),
            CategoryId: faker.datatype.number({ min: 1, max: 4}),
            UserId: 1
        }));

        await Task.bulkCreate(fakeTasks);
        console.log(`*****SEED***** ${numTasks} tasks seeded successfully.`);
    } catch (error) {
        console.log('Error seeding tasks:', error.message);
    }
};

export default seedTask;
