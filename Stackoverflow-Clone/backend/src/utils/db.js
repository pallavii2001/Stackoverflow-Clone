const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
 

conn.connect((err) => {
    if (err)
        throw err;
    console.log('Database Connected');
});

async function executeQuery(query, values) {
    //console.log(query);
    return new Promise((resolve, reject) => {
        conn.query(query, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = executeQuery;
