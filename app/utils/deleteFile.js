const fs = require('fs')
const path = require('path')


function deleteImage(imageName) {
  try {
    const folderPath = __dirname + '/../uploads/'
    const pathFile = path.join(folderPath, imageName)
    // Verificar si el archivo existe antes de intentar eliminarlo
    if (fs.existsSync(pathFile)) {
      // Eliminar el archivo
      fs.unlink(pathFile, (error) => {
        if (error) {
          return {
            error: true,
            message: `Error: ${error}`,
            pathImage: imageName
          }
        }
      })      
    } else {
      return {
        error: true,
        message: 'No existe la imagen: ' + imageName,
        pathImage: imageName
      }
    }
  } catch(error) {
    console.log('Error al eliminar imagen que no existe')
    console.log(error)
  }
}

function deleteImagesGroup(imgNames) {
  for(let img of imgNames) {
    deleteImage(img.filename)
  }
}

module.exports = { 
  deleteImage,
  deleteImagesGroup
}