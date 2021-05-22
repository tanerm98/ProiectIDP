const {
    queryAsync
} = require('..');

const addAsync = async (first_name, last_name) => {
    console.info(`Adding author in database async...`);

    const authors = await queryAsync('INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING *', [first_name, last_name]);
    return authors[0];
};

const getAllAsync = async () => {
    console.info(`Getting all authors from database async...`);

    return await queryAsync('SELECT * FROM authors');
};

const getByIdAsync = async (id) => {
    console.info(`Getting the author with id ${id} from database async...`);

    const authors = await queryAsync('SELECT * FROM authors WHERE id = $1', [id]);
    return authors[0];
};

const updateByIdAsync = async (id, first_name, last_name) => {
    console.info(`Updating the author with id ${id} in database async...`);

    const authors =  await queryAsync('UPDATE authors SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *', [first_name, last_name, id]);
    return authors[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the author with id ${id} from database async...`);

    const authors = await queryAsync('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
    return authors[0];
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync
}