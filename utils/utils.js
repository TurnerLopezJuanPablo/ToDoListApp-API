export const generateUniqueTitle = async (desiredName, Model) => {
    let newName = desiredName;
    let count = 1;

    while (await Model.findOne({ where: { title: newName } })) {
        newName = `${desiredName} (${count})`;
        count++;
    }

    return newName;
};