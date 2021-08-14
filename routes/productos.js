const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeNombreProducto, noExisteNombreProducto, existeCategoriaID, existeProductoID } = require('../helpers/db-validators');
const { validarJWT, tieneRol, validarCampos, esAdminRol } = require('../middleware');
const { tienePrecio, validaActProducto } = require('../middleware/validar-productos');

const router = Router();
/**
 * 
 */
router.get('/',obtenerProductos);

router.get('/:id',[
    check('id','El id del producto es obligatorio').notEmpty(),
    check('id','Se debe proporcionar un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoID),
    validarCampos
],obtenerProducto);

router.post('/',[
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('categoria','La categoria es obligatoria').notEmpty(),
    check('categoria','El id de catagoría debe ser un id válido').isMongoId(),
    tienePrecio,
    validarJWT,
    tieneRol('ADMIN_ROLE','USER_ROLE'),
    check('nombre').custom(noExisteNombreProducto),
    check('categoria').custom(existeCategoriaID),
    validarCampos
],crearProducto);

router.put('/',[
    check('id','El id del producto es obligatorio').notEmpty(),
    check('id','El id del producto debe ser un id válido').isMongoId(),
    validaActProducto,
    validarJWT,
    tieneRol('ADMIN_ROLE','USER_ROLE'),
    tienePrecio,
    validarCampos
],actualizarProducto);

router.delete('/',[
    check('id','El id del producto es obligatorio').notEmpty(),
    check('id','El id del producto debe ser un id válido').isMongoId(),
    check('id').custom(existeProductoID),
    validarJWT,
    esAdminRol,
    validarCampos
],borrarProducto);


module.exports=router;