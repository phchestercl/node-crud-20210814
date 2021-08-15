const validarCampos         = require('../middleware/validar-campos');
const validarJWT            = require('../middleware/validarjwt');
const validaRoles           = require('../middleware/validar-roles');
const validarArchivoSubir   = require('../middleware/validar-archivo-subir')

module.exports={
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivoSubir
}