const mysql = require('mysql');
const config = require("../config");

module.exports = mysql.createPool({
    connectionLimit: 10,
    host: config.AWS_RDS_HOST,
    user: config.AWS_RDS_USER,
    password: config.AWS_RDS_PASSWORD,
    database: config.AWS_RDS_DB
})