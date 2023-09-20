const RDS = require('../lib/rds');
const mysql = new RDS();

async function testQuery() {
    const data = await mysql.executeQuery("SELECT * FROM materia");
    return data;
}

module.exports = { testQuery }