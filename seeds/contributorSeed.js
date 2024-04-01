import faker from 'faker';
import { Contributor } from '../models/index.js';

const seedContributor = async (numContributor) => {
    try {
        // const manualContributor = {
        //     permit: 'owner',
        //     BoardId: 1,
        //     UserId: 1,
        // };

        // await Contributor.bulkCreate(manualContributor);
        // const fakeContributors = Array.from({ length: numContributor - 1 }, () => ({
        //     permit: ['reader', 'commentor', 'editor'][Math.floor(Math.random() * 3)],
        //     BoardId: Math.floor(Math.random() * 3) + 1,
        //     UserId: Math.floor(Math.random() * 5) + 1,
        // }));

        // const fakeContributorsArr = [manualContributor, ...fakeContributors];
        // await Contributor.bulkCreate(fakeContributorsArr);
        console.log(`********** SEED CONTRIBUTOR ********** ${numContributor} contributors seeded successfully.`);
    } catch (error) {
        console.log('Error seeding contributors:', error.message);
    }
};

export default seedContributor;
