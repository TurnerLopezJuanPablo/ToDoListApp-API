export const permit = Object.freeze({
    Owner: 'owner',
    Editor: 'editor',
    Reader: 'reader',
    Commentor: 'commentor',
});

export const priority = Object.freeze({
    High: 'high',
    Medium: 'medium',
    Low: 'low',
    None: 'none'
});

export const generateUniqueTitle = async (desiredName, Model, id, fieldName) => {
    let newName = desiredName;
    let count = 1;

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
