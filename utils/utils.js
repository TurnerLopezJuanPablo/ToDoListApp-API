export const generateUniqueTitle = async (desiredName, Model, id, fieldName) => {
    let newName = desiredName;
    let count = 1;

    console.log(id, fieldName, "**************************");

    if (id === 0 || fieldName === null) {
        while (await Model.findOne({ where: { title: newName } })) {
            newName = `${desiredName} (${count})`;
            count++;
        }
    } else {
        while (await Model.findOne({ where: { title: newName, [fieldName]: id } })) {
            newName = `${desiredName} (${count})`;
            count++;
        }
    }

    return newName;
};