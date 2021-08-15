const {Router}=require('express');
const { check}=require('express-validator');
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads');
const { colecionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir } = require('../middleware');

router=Router();


router.post('/', [  validarArchivoSubir,
                    validarCampos],cargarArchivo);

router.put('/:coleccion/:id',[
    check('id','Debe ser un ID válido').isMongoId(),
    check('coleccion').custom( c=>colecionesPermitidas(c,['usuarios','productos'])),
    validarArchivoSubir,
    validarCampos
], actualizarImagen);

module.exports=router;