const { USER_STATUS } = require('../constants')
const db = require('../database/config')
const { UserStatus } = require('../models')

async function add(req, res) {
  const transaction = await db.transaction()
  try {
    const statuses = Object.keys(USER_STATUS).map((key) => ({name: key}))
    await UserStatus.bulkCreate(statuses, {transaction})
    transaction.commit()
    // Restornamos los datos de la sesión
    return res.json({result: true, message: 'Estatuses creados correctamente'})
  } catch (error) {
    console.log(error)
    return res.json({ error: true, message: 'Error al crear los estatuses'})
  }
}

async function getAll(req, res) {
  try {
    const roles = await UserStatus.findAll()
    return res.json({result: true, data: roles})
  } catch (error) {
    console.log(error)
    return res.json({ error: true, message: 'Error al listar los roles'})
  }
}


module.exports = {
  add,
  getAll
}