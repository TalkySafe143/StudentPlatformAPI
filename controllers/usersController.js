const RDS = require('../lib/rds');
const rds = new RDS();

const encryptionWorker = require("../utils/encryptionWorker");

async function createUser(req, res, next) {
    const user = req.body;

    if (encryptionWorker.checkSQLEntry(user)) {
      return res.status(404).json({
        error: "Ups, al parecer tu query esta mal estructurada"
      })
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

async function getOneUser(req, res, next){
  const { id } = req.params;

  const queryObject = {
    "FROM": ["estudiante"],
    "WHERE": [{
      "column": "cc",
      "type": "=",
      "value": `'${id}'`
    }]
  }
  
  const data = await rds.buildSelectQuery(queryObject);

  res.status(200).json({
    message: "Usuario extraido correctamente",
    data
  })
}

async function updateUser(req, res, next) {
  const {id} = req.params;

  if (encryptionWorker.checkSQLEntry(req.body)) {
    return res.status(404).json({
      error: "Ups, algo paso en la consulta"
    });
  }

  
  const updateObject = {
    "column": Object.entries(req.body)[0][0],
    "newValue": Object.entries(req.body)[0][1],
    "condition": [{
      "column": "cc",
      "type" : "=",
      "value": `'${id}'`
    }]
  }

  const data = await rds.buildUpdateQuery("estudiante", updateObject);

  res.status(200).json({
    message: "Usuario actualizado correctamente",
    data
  })
}

async function deleteUser(req, res, next) {
  const {id} = req.params;
  const deleteObject = {
    "condition": [{
      "column": "cc",
      "type": "=",
      "value": `'${id}'`
    }]
  }

  const data = await rds.buildDeleteQuery("estudiante", deleteObject);

  res.status(200).json({
    message: "Usuario eliminado exitosamente",
    data
  })
}

module.exports = { createUser, getAllUsers, getOneUser, updateUser, deleteUser };