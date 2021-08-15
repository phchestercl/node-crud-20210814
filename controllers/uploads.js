const path = require('path');
const { response } = require('express');



const cargarArchivo = (req, res = response) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }
    if (!req.files.archivo) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }
    /* console.log('req.files >>>', req.files); // eslint-disable-line */

    const {archivo} = req.files;
    /* console.log('Directorio >>>');
    console.log(__dirname);
    console.log('Directorio Principal >>>');
    console.log(process.cwd()); */
    uploadPath = path.join(process.cwd() + '/uploads/' + archivo.name);

    archivo.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).json({err});
        }

        res.json(
            { msg:`El archivo subio al directorio ${uploadPath}`}
        );
    });

/* 
      console.log(req.files)
      res.status(200).json({
          msg:'Carga Archivos'
      }) */
};


module.exports = {
    cargarArchivo
}