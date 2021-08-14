const { Router } = require('express');
const { check } = require('express-validator');
/* const { validarCampos} =require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validarjwt');
const { esAdminRol, tieneRol } = require('../middleware/validar-roles'); */
const { validarCampos,
        tieneRol,
        validarJWT} =require('../middleware')

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/user');
const { esRolValido, existeMail, existeUsuarioPorID } = require('../helpers/db-validators');

const router = Router();


router.get('/', usuariosGet );

router.post('/', [check('nombre', 'Se debe indicar un nombre').not().isEmpty(),
                    check('password','El password debe tener más de 6 letras').isLength({min:6}),
                    check('correo','El correo no es válido').isEmail(),
                    check('correo').custom(existeMail),
                    /* check('role','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']), */
                    check('role').custom( esRolValido ),
                    validarCampos
                    ],
                usuariosPost );

router.put('/:id', [check('id','No es un id válido').isMongoId(),
                    check('id').custom(existeUsuarioPorID),
                    check('role').custom(esRolValido),
                    validarCampos

],usuariosPut );

router.delete('/:id',[ 
                        validarJWT,
                        /* esAdminRol, */
                        tieneRol('ADMIN_ROLE','SALES_ROLE'),
                        check('id','No es un id válido').isMongoId(),
                        check('id').custom(existeUsuarioPorID),
                        validarCampos
], usuariosDelete);

router.patch('/',usuariosPatch)






module.exports = router;