const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "qwerty",
    host: "db",
    port: "5459",
    database: "online_school"
});

module.exports = pool
