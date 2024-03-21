import faker from 'faker';
import { Group } from '../models/index.js';

const seedGroup = async (numGroups) => {
    try {
        const fakeGroups = Array.from({ length: numGroups }, () => ({
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            UserId: 1
        }));

        await Group.bulkCreate(fakeGroups);
        console.log(`*****SEED***** ${numGroups} groups seeded successfully.`);
    } catch (error) {
        console.log('Error seeding groups:', error.message);
    }
};

export default seedGroup;
