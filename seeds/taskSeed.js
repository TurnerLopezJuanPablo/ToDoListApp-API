import faker from 'faker';
import { Task } from '../models/index.js';

const seedTask = async (numTasks) => {
    try {
        const fakeTasks = Array.from({ length: numTasks }, () => ({
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            due_date: faker.date.future(),
            priority: faker.random.arrayElement(['low', 'medium', 'high', ]),
            GroupId: faker.random.number({ min: 1, max: 3}),
            CategoryId: faker.random.number({ min: 1, max: 4}),
            UserId: 1
        }));

        await Task.bulkCreate(fakeTasks);
        console.log(`${numTasks} tasks seeded successfully.`);
    } catch (error) {
        console.log('Error seeding tasks:', error.message);
    }
};

export default seedTask;
