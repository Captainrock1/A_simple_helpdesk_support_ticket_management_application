const mysql = require('mysql2');

var connection = mysql.createPool({
    host: 'localhost', // MYSQL HOST NAME
    user: 'root', // MYSQL USERNAME
    port: 3306, // NEW PORT NUMBER
    password: '', // MYSQL PASSWORD
    database: 'weticket', // MYSQL DB NAME
    namedPlaceholders: true, // set at the connection level
    waitForConnections: true, // the pool's action when no connections are available and the limit has been reached
    connectionLimit: 5, // the limit of concurrent connections
    queueLimit: 0 // the limit of the service rate for the given queue
}).promise();

module.exports = connection;