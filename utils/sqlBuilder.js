const boom = require('@hapi/boom');

const generateConditionQuery = (where, filters) => {
    filters.push(
        `${where["column"]} ${where["type"]} (${
            typeof(where["value"]) === "string" ? where["value"] : generateQuery(where["value"])
        }) ${
            Object.keys(where["value"]).find(val => val === 'rename') ? ` ${where["value"]["rename"]} `: ""
        } ${
            where["connector"] ? where["connector"] : ""
        } `
    )
}

function generateQuery(queries) {
    let statement = "SELECT ";
    // SELECT comes as a string array or object to rename
    /*
    * renameObject
    * {
    *   column, -> original name
    *   rename -> name to override
    * }
    * */
    if (queries["SELECT"]) {
        let indexToDeleteDistinct;
        if (queries["SELECT"].find((val, index) => {
            if (val.toLowerCase() === 'distinct') indexToDeleteDistinct = index;
            return val.toLowerCase() === 'distinct';
        })) {
            statement += "DISTINCT ";
            delete queries["SELECT"][indexToDeleteDistinct];
        }
        const selectColumns = [];

        queries["SELECT"].forEach(select => {
            let preparedStr = "";
            typeof(select) === 'string' ? preparedStr += select + " " : preparedStr += `${select["column"]} AS ${select["rename"]} `;
            selectColumns.push(preparedStr);
        })

        statement += selectColumns.join(", ")
    }
    else statement += `* `
    // FROM comes as a string array and Object to specify the JOIN
    /*
    * JOIN setting object
    * {
    *   type, -> "INNER JOIN" | "OUTER JOIN"
    *   table, -> Table to join | Can be a query object with "rename" property to exec a rename
    *   condition : [{
           column,
           type, -> ">" | "<" | ">=" | "LIKE" | "ON"
           value, -> Can be query object.
           connector? -> "AND" | "OR" to the next filter
         }]
    * }
    * */
    if (queries["FROM"]){
        const joinFilters = [];

        if (queries["FROM"].length > 2) throw boom.badRequest('JOIN solo se puede hacer con 2 tablas');

        if (queries["FROM"].length === 1) statement += `FROM ${queries["FROM"][0]} `
        else {
            queries["FROM"][1]["condition"].forEach(condition => {
                joinFilters.push(
                    `${condition["column"]} ${condition["type"]} (${
                        typeof(condition["value"]) === "string" ?  condition["value"] : generateQuery(condition["value"])
                    }) ${
                        condition["connector"] ? condition["connector"] : ""
                    } `
                )
            })
            statement += `FROM ${queries["FROM"][0]} ${queries["FROM"][1]["type"]} (${
                typeof(queries["FROM"][1]["table"]) === 'string' ? queries["FROM"][1]["table"] : generateQuery(queries["FROM"][1]["table"])
            }) ${
                Object.keys(queries["FROM"][1]["table"]).find(val => val === 'rename') ? ` ${queries["FROM"][1]["table"]["rename"]} `: ""
            } ON ${joinFilters.join("")} `
        }
    }
    else throw boom.badRequest('Debe existir un FROM o alguna tabla a la cual consultar')
    // WHERE comes as a object array
    /*
    * {
    *   column,
    *   type, -> ">" | "<" | ">=" | "LIKE" | "ON"
    *   value, -> Can be query object with "rename" property.
    *   connector? -> "AND" | "OR" to the next filter
    * }
    * */
    if (queries["WHERE"]) {
        const filters = []
        queries["WHERE"].forEach(where => {
            generateConditionQuery(where, filters);
        })

        statement += `WHERE ${filters.join("")} `
    }

    // GROUP BY comes as string array
    if(queries["GROUP BY"]) {
        statement += `GROUP BY (${queries["GROUP BY"].join(",")}) `;
    }

    if (queries["HAVING"]) {
        const filters = []
        queries["HAVING"].forEach(where => {
            generateConditionQuery(where, filters);
        })

        statement += `HAVING ${filters.join("")} ;`
    }
    return statement;
}

function generateInsertStatement(table, data) {
    return `INSERT INTO ${table} (${Object.keys(data).join(", ")}) VALUES(${Object.values(data).join(", ")}) `
}


/*
* update object
* {
*   column, -> Column affected
*   newValue, -> New value for the column,
*   condition: [{
    *   column,
    *   type, -> ">" | "<" | ">=" | "LIKE" | "ON"
    *   value, -> Can be query object with "rename" property.
    *   connector? -> "AND" | "OR" to the next filter
    * }]
* }
*
* */
function generateUpdateStatement(table, update) {
    if (!update["condition"]) throw boom.badRequest('Para eliminar debe tener un Condition Object')
    let statement = `UPDATE ${table} SET ${update["column"]} = ${update["newValue"]} `

    const filters = [];

    update["condition"].forEach(where => {
        generateConditionQuery(where, filters);
    })

    statement += `WHERE ${filters.join("")} `

    return statement;
}

function generateDeleteStatement(table, deleteData) {
    if (!deleteData["condition"]) throw boom.badRequest('Para eliminar debe tener un Condition Object')
    let statement = `DELETE FROM ${table} `;

    const filters = [];

    deleteData["condition"].forEach(where => {
        generateConditionQuery(where, filters);
    })

    statement += `WHERE ${filters.join("")} `;

    return statement;
}

module.exports = { generateQuery, generateInsertStatement, generateUpdateStatement, generateDeleteStatement }