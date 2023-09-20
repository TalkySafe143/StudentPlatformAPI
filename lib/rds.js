const pool = require('./connectionPool');
const config = require('../config');
const {generateUpdateStatement, generateDeleteStatement, generateQuery} = require("../utils/sqlBuilder");

const generateQueryPromise =  (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results, fields) => {
            if (err) reject(err)
            resolve(results)
        })
    })
}

class RDS {
    executeQuery(query) {
        return generateQueryPromise(query);
    }

    insertData(table, entries) {
        const query = `INSERT INTO ${table}(${Object.keys(entries).join()}) VALUES(${Object.values(entries).join()});`
        return generateQueryPromise(query);
    }

    getData(table, columns) {
        const query = `SELECT ${columns.length === 0 ? "*" : columns.join()} FROM ${table};`
        return generateQueryPromise(query);
    }

    buildUpdateQuery(table, updateObject) {
        const query = generateUpdateStatement(table, updateObject);
        return generateQueryPromise(query);
    }

    buildDeleteQuery(table, deleteObject) {
        const query = generateDeleteStatement(table, deleteObject);
        console.log(query)
        return generateQueryPromise(query);
    }

    buildSelectQuery(queryObject) {
        const query = generateQuery(queryObject);
        return generateQueryPromise(query);
    }
}

module.exports = RDS;