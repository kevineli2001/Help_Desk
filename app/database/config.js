const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Requerir una conexión SSL/TLS
      rejectUnauthorized: false // Desactivar la verificación del certificado (puedes establecerlo en 'true' en producción)
    }
  }
})

sequelize.authenticate()
  .then(() =>{
    console.log('Logged')
  })

module.exports = sequelize