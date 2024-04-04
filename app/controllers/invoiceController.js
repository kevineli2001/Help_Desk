const sequelize = require('../database/config')
const { Op, where, col, fn } = require('sequelize')
const { getErrorFormat } = require('../utils/errorsFormat')
const { Provider, Invoice } = require('../models/index')

async function getAll(req, res) {
  try {
    let invoices = await Invoice.findAll()
    res.json({
      data: invoices
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}

async function count(req, res) {
  try {
    let invoices = await Invoice.count()
    res.json({
      data: { 
        section: 'Facturas',
        rows: invoices 
      }
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}

async function getByProvider(req, res) {
  try {
    let { id } = req.params
    let invoices = await Invoice.findAll({where: {providerId: id}})
    res.json({
      data: invoices
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}

async function paginate(req, res) {
  try {
    let { perPage, currentPage } = req.query
    let invoices = await Invoice.findAndCountAll({
      include: [Provider],
      raw: true,
      limit: parseInt(perPage),
      offset: (parseInt(currentPage) - 1) * parseInt(perPage)
    })
    res.json({
      data: invoices
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}

async function paginateAndFilter(req, res) {
  try {
    let { filter, perPage, currentPage } = req.body
    perPage = parseInt(perPage)
    currentPage = parseInt(currentPage)
    let invoices = await Invoice.findAndCountAll({
      include: [Provider],
      where: { 
        [Op.or]: [
          where(fn('LOWER', col('name')), 'LIKE', `%${filter.toLowerCase()}%`),
          where(fn('LOWER', col('code')), 'LIKE', `%${filter.toLowerCase()}%`),
          where(fn('LOWER', col('date')), 'LIKE', `%${filter.toLowerCase()}%`),
          where(fn('LOWER', col('observation')), 'LIKE', `%${filter.toLowerCase()}%`),
          where(fn('LOWER', col('Provider.name')), 'LIKE', `%${filter.toLowerCase()}%`)
        ]
      },
      raw: true,
      limit: perPage,
      offset: (currentPage - 1) * perPage

    })
    res.json({ data: invoices })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}


async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Invoice.create(req.body, {transaction})
    // Guardamos los cambios
    await transaction.commit() 
    return res.json({
      done: true,
      msg: 'Factura registrado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al crear factura', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Invoice.update(req.body, {where: {id: req.found.id}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Factura actualizado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al actualizar factura', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Invoice.destroy({ where: { id: req.params.id }, transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Factura eliminada correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    if(error.parent && error.parent.errno === 1451) {
      return res.json({
        error: true,
        msg: 'No es posible eliminar factura, porque hay items guardados y vinculados a esta factura'
      })
    }
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al eliminar factura', errorName) }
    let errorKeys = [errorName]
    return res.json({ errors, errorKeys})
  }
}


module.exports = {
  add,
  update,
  remove,
  paginate,
  getAll,
  getByProvider,
  count,
  paginateAndFilter
}