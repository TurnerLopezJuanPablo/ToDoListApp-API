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
        };

        const fakeUsers = Array.from({ length: numUsers - 1 }, (_, i) => ({
            userName: faker.internet.userName(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            birthDate: faker.date.past(),
            email: `email${i}@example.com`,
            password: 'Contraseña1234',
        }));

const users = [manualUser, ...fakeUsers];
await User.bulkCreate(users);
console.log(`********** SEED USER ********** ${numUsers} users seeded successfully.`);
    } catch (error) {
    console.log('Error seeding users:', error.message);
}
};

export default seedUser;
