
const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');



const cargarArchivo = async (req, res = response) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }
    if (!req.files.archivo) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }
    /* console.log('req.files >>>', req.files); // eslint-disable-line */
    try {
        const resol = await subirArchivo(req.files,['webp'],'imgs/',['image/webp']);
        res.status(200).json({
            resol
        })
    } catch (error) {
        res.status(500).json({
            msg:error
        })
    }
    
};


module.exports = {
    cargarArchivo,

}