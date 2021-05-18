const {
    queryAsync
} = require('..');

const addAsync = async (name) => {
    console.info(`Adding publisher in database async...`);

    const publishers = await queryAsync('INSERT INTO publishers (name) VALUES ($1) RETURNING *', [name]);
    return publishers[0];
};

const getAllAsync = async () => {
    console.info(`Getting all publishers from database async...`);

    return await queryAsync('SELECT * FROM publishers');
};

const getByIdAsync = async (id) => {
    console.info(`Getting the publisher with id ${id} from database async...`);

    const publishers = await queryAsync(`
    SELECT 
        b.id as book_id, b.name as book_name,
        a.id as author_id, a.first_name as author_first_name, a.last_name as author_last_name,
        p.id as publisher_id, p.name as publisher_name,
        pb.price as price
    FROM publishers p
    JOIN publishers_books pb
        ON pb.publisher_id = p.id
    JOIN books b 
        ON pb.book_id = b.id 
    JOIN authors a 
        ON b.author_id = a.id
    WHERE p.id = $1`, [id]);

    return publishers;
};

const updateByIdAsync = async (id, name) => {
    console.info(`Updating the publisher with id ${id} in database async...`);

    const publishers =  await queryAsync('UPDATE publishers SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    return publishers[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the publisher with id ${id} from database async...`);

    const publishers = await queryAsync('DELETE FROM publishers WHERE id = $1 RETURNING *', [id]);
    return publishers[0];
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync
}