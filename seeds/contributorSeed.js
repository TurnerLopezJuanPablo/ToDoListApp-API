import { Contributor } from '../models/index.js';
import { permit } from '../utils/utils.js';

const seedContributor = async () => {
    try {
        const fakeContributors = [
            {
                permit: permit.Owner,
                BoardId: 1,
                UserId: 1,
            }, 
            {
                permit: permit.Editor,
                BoardId: 2,
                UserId: 1,
            }, 
            {
                permit: permit.Commentor,
                BoardId: 3,
                UserId: 1,
            }, 
            {
                permit: permit.Reader,
                BoardId: 4,
                UserId: 1,
            }, 
            {
                permit: permit.Editor,
                BoardId: 1,
                UserId: 2,
            }, 
            {
                permit: permit.Commentor,
                BoardId: 1,
                UserId: 3,
            }, 
            {
                permit: permit.Reader,
                BoardId: 1,
                UserId: 4,
            }, 
            {
                permit: permit.Owner,
                BoardId: 2,
                UserId: 3,
            }, 
            {
                permit: permit.Reader,
                BoardId: 2,
                UserId: 4,
            }, 
            {
                permit: permit.Commentor,
                BoardId: 2,
                UserId: 5,
            },
            {
                permit: permit.Owner,
                BoardId: 2,
                UserId: 3,
            }, 
            {
                permit: permit.Commentor,
                BoardId: 2,
                UserId: 5,
            },
        ];

        await Contributor.bulkCreate(fakeContributors);
        console.log(`********** SEED CONTRIBUTOR ********** Contributors seeded successfully.`);
    } catch (error) {
        console.log('Error seeding contributors:', error.message);
    }
};

export default seedContributor;
