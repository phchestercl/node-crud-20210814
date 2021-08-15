const {Router}=require('express');
const { check}=require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { colecionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir } = require('../middleware');


const router=Router();


router.post('/', [  validarArchivoSubir,
                    validarCampos],cargarArchivo);

router.put('/:coleccion/:id',[
    check('id','Debe ser un ID válido').isMongoId(),
    check('coleccion').custom( c=>colecionesPermitidas(c,['usuarios','productos'])),
    validarArchivoSubir,
    validarCampos
], actualizarImagen);

router.get('/:coleccion/:id',[
    check('id','Debe ser un ID válido').isMongoId(),
    check('coleccion').custom( c=>colecionesPermitidas(c,['usuarios','productos']) ),
    validarCampos
],mostrarImagen)

module.exports=router;