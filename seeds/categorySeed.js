import faker from 'faker';
import { Category } from '../models/index.js';

const BoardIds = [1, 1, 2, 2, 3, 3, 4, 4];

const seedCategory = async (numCategory) => {
    try {
        const fakeCategories = Array.from({ length: numCategory }, (_, i) => ({
            title: faker.commerce.productName(),
            BoardId: BoardIds[i % BoardIds.length],
        }));

        await Category.bulkCreate(fakeCategories);
        console.log(`********** SEED CATEGORY ********** ${numCategory} categories seeded successfully.`);
    } catch (error) {
        console.log('Error seeding categories:', error.message);
    }
};

export default seedCategory;
