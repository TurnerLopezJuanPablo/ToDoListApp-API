import faker from 'faker';
import { User } from '../models/index.js';

const seedUser = async (numUsers) => {
    try {
        const manualUser = {
            userName: 'Juancito8899',
            name: 'Juan',
            surname: 'Perez',
            birthDate: new Date('1990-01-01'),
            email: 'admin@admin.com',
            password: 'Admin1234',
            createdAt: new Date(),
        };

        const fakeUsers = Array.from({ length: numUsers - 1 }, () => ({
            userName: faker.internet.userName(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            birthDate: faker.date.past(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            createdAt: new Date(),
        }));

        const users = [manualUser, ...fakeUsers];
        await User.bulkCreate(users);
        console.log(`${numUsers} users seeded successfully.`);
    } catch (error) {
        console.log('Error seeding users:', error.message);
    }
};

export default seedUser;
