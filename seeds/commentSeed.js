import faker from 'faker';
import { Comment } from '../models/index.js';

const seedComment = async (numComment) => {
    try {
        const fakeComments = Array.from({ length: numComment }, () => ({
            title: faker.lorem.words(2),
            TaskId: 1,
            UserId: 1
        }));

        await Comment.bulkCreate(fakeComments);
        console.log(`*****SEED***** ${numComment} comments seeded successfully.`);
    } catch (error) {
        console.log('Error seeding comments:', error.message);
    }
};

export default seedComment;
