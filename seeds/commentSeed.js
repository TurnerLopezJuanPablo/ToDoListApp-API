import faker from 'faker';
import { Comment } from '../models/index.js';

const seedComment = async (numComment) => {
    try {
        const fakeComments = Array.from({ length: numComment }, () => ({
            text: faker.commerce.productName(),
            TaskId: Math.floor(Math.random() * 3) + 1,
            UserId: Math.floor(Math.random() * 3) + 1,
        }));

        await Comment.bulkCreate(fakeComments);
        console.log(`********** SEED COMMENT ********** ${numComment} comments seeded successfully.`);
    } catch (error) {
        console.log('Error seeding comments:', error.message);
    }
};

export default seedComment;
