const RDS = require('../lib/rds');
const rds = new RDS();
async function createUser(req, res, next) {
    const user = req.body;
    const onlyLettersPattern = /^[A-Za-z0-9]+$/;
    // SQL injection
    for (const [key, value] of Object.entries(user)) {
        if (key.toUpperCase().includes("SELECT")
            || key.toUpperCase().includes("DELETE")
            || key.toUpperCase().includes("INSERT")
            || key.toUpperCase().includes("UPDATE")
            || value.toUpperCase().includes("SELECT")
            || value.toUpperCase().includes("DELETE")
            || value.toUpperCase().includes("INSERT")
            || value.toUpperCase().includes("UPDATE")
            || !key.match(onlyLettersPattern)
            || !value.match(onlyLettersPattern)) {
            return res.status(400).json({
                err: "SQL Injection?"
            })
        }
    }

    const data = await rds.insertData("estudiante", user);

    res.status(200).json({
        message: "Usuario creado exitosamente",
        data
    })
}

async function getAllUsers(req, res, next) {
    const data = await rds.getData("estudiante", []);
    res.status(200).json({
        message: "Usuarios extraidos correctamente",
        data
    })
}

module.exports = { createUser, getAllUsers }