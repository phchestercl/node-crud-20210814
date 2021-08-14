const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, crearCategoria, obtenerCategotia, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaID } = require('../helpers/db-validators');
/* const { validarCampos} =require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validarjwt');
const { esAdminRol, tieneRol } = require('../middleware/validar-roles'); */
const { validarCampos,
        tieneRol,
        validarJWT,
        esAdminRol} =require('../middleware');

const router = Router();
router.get('/',obtenerCategorias);

router.get('/:id',[
    check('id','Se debe proporcionar un id valido').isMongoId(),
    check('id').custom( existeCategoriaID),
    validarCampos
], obtenerCategotia);




router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria);



router.put('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    tieneRol('ADMIN_ROLE','USER_ROLE'),
    check('id','Se debe proporcionar un id valido').isMongoId(),
    check('id').custom( existeCategoriaID),
    validarCampos
], actualizarCategoria);

router.delete('/',[
    validarJWT,
    esAdminRol,
    check('id','Se debe proporcionar un id valido').isMongoId(),
    check('id').custom( existeCategoriaID),
    validarCampos

], borrarCategoria);



module.exports=router;