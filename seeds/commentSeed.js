import faker from 'faker';
import { Comment } from '../models/index.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seedComment = async (numComment) => {
    try {
        const fakeComments = Array.from({ length: numComment }, () => ({
            text: faker.commerce.productName(),
            TaskId: Math.floor(Math.random() * 8) + 1,
            UserId: Math.floor(Math.random() * 3) + 1,
        }));

        for (const comment of fakeComments) {
            await Comment.create(comment);
            await delay(1000);
        }

        console.log(`********** SEED COMMENT ********** ${numComment} comments seeded successfully.`);
    } catch (error) {
        console.log('Error seeding comments:', error.message);
    }
};

export default seedComment;
