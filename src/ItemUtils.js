
let nextId = 1;

export const getNextId = () => {
    return nextId++;
};

export const setLastId = (lastId) => {
    nextId = lastId + 1;
};
