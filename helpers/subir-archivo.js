const path = require('path');
const { access, mkdir } = require('fs');
const fsPromises = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const mmm = require('mmmagic'), Magic = mmm.Magic;

/**
 * 
 * @param {Nombre del archivo} files 
 * @param {Array con las extensiones válidas} extensionesValidas 
 * @param {Nombre del directorio dónde se almacenará la información} directorio 
 * @param {Array Tipos mimes Validos} mimeTypeValidos 
 * @returns 
 * sube archivo especificado a la carpeta indicada, valida la extenciòn y el tipo de archivo
 */
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'webp',], directorio = '', mimeTypeValidos = ['image/webp', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif']) => {

    return new Promise((resolve, reject) => {
        // obtengo el nombre el archivo
        const { archivo } = files;
        // Obtengo la extension del archivo
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        /**
         * Validar Extension
         */

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} del archivo no es válida`);
        }
        /**
         * Valida que la carpeta exista
         */
        
        
        const nombreArchivo = uuidv4() + '.' + extension;
        const uploadPath = path.join(process.cwd() + '/uploads/' + directorio+ nombreArchivo);

        archivo.mv(uploadPath, function (err) {
            if (err) {
                return reject(err);
            }
            const magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);
            magic.detectFile(uploadPath, function (err, result) {
                if (err) {
                    return reject(err);
                };
                /* console.log(result);
                console.log('tipo mime >>> : ' + result.split(';')[0]); */
                //Si el archivo no es unn archivo de imagen se borra del directorio
                if(!mimeTypeValidos.includes(result.split(';')[0])){
                    //Borra el archivo
                    fs.unlink(uploadPath,(err)=>{
                        if (err) reject (err);
                    })
                    // Devuelve mensaje de error
                    return reject(`El servidor detectó que archivo ${archivo.name} no corresponde a un archivo de imagenes, por lo que fue borrado`);
                }
                resolve(nombreArchivo);
            });
        });

    });
}



module.exports = {
    subirArchivo
}