const { Pool } = require('pg');
const { getSecret } = require('docker-secret');

const options = {
  host: "database_db_1", //process.env.PGHOST,
  database: "bookstore", //process.env.PGDATABASE,
  port: "5432", //process.env.PGPORT,
  user:"dbuser", 
    //process.env.NODE_ENV === "development"
    //  ? process.env.PGUSER
    //  : getSecret(process.env.PGUSER_SECRET),
  password:"dbpass",
   // process.env.NODE_ENV === "development"
    //  ? process.env.PGPASSWORD
    //  : getSecret(process.env.PGPASSWORD_SECRET),
};

const pool = new Pool(options);

const queryAsync = async (text, params) => {
  const start = Date.now();

  const {
    rows,
  } = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log(`Query took ${duration} and returned ${rows.length} rows.`);

  return rows;
};

module.exports = {
  queryAsync,
};
