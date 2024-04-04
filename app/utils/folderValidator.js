const fs = require('fs')

function validateFolder(path) {  
  // Verificar si la carpeta existe
  if (!fs.existsSync(path)) {
    // Si la carpeta no existe, intenta crearla
    try {
      fs.mkdirSync(path) // Crea la carpeta
      console.log('La carpeta se ha creado correctamente.')
    } catch (error) {
      console.error('Error al crear la carpeta:', error)
    }
  } else {
    console.log('La carpeta ya existe.')
  }
}

module.exports = { validateFolder }