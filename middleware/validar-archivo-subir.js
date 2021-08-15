

const validarArchivoSubir=(req,res,next)=>{

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }
    if (!req.files.archivo) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }
    next()
}

module.exports={
    validarArchivoSubir
}