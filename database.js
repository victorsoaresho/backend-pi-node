const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysqltrabalho.mysql.database.azure.com',
  user: 'arthur',
  password: '741258ar@',
  database: 'pi',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();