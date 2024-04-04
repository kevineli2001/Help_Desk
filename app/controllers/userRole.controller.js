const { ROLES_TYPE } = require('../constants')
const db = require('../database/config')
const { Role } = require('../models')

async function add(req, res) {
  const transaction = await db.transaction()
  try {
    const roles = Object.keys(ROLES_TYPE).map((key) => ({name: key}))
    await Role.bulkCreate(roles, {transaction})
    transaction.commit()
    // Restornamos los datos de la sesión
    return res.json({result: true, message: 'Roles creados correctamente'})
  } catch (error) {
    console.log(error)
    return res.json({ error: true, message: 'Error al crear los roles'})
  }
}

async function getAll(req, res) {
  try {
    const roles = await Role.findAll()
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