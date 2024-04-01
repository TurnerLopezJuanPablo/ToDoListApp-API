import faker from 'faker';
import { Category } from '../models/index.js';

const seedCategory = async (numCategory) => {
    try {
        const fakeCategories = Array.from({ length: numCategory }, () => ({
            title: faker.commerce.productName(),
            BoardId: Math.floor(Math.random() * 3) + 1,
        }));

        await Category.bulkCreate(fakeCategories);
        console.log(`********** SEED CATEGORY ********** ${numCategory} categories seeded successfully.`);
    } catch (error) {
        console.log('Error seeding categories:', error.message);
    }
};

export default seedCategory;
