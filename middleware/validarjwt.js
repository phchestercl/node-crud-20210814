const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT= async (req=request, res=response, next)=>{
    //los jwt deben ir idealmente en los headers
    const token = req.header('x-token');
    /* console.log(token); */
    if (!token) {
        return res.status(400).json({
            msg:'No hay un token en la petición'
        });
    }
    try {
        const { uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        /* console.log(uid); */
        
        const usuarioAut = await Usuario.findById(uid);
        if (!usuarioAut) {
            return res.status(401).json({
                msg:'El usuario no existe'
            })
        }
        /* console.log(usuarioAut); */
        // verificar si el usuario tiene estado false
        if (!usuarioAut.estado){
            return res.status(401).json({
                msg:'El usuario no esta activo'
            })
        }

        req.usuarioAut=usuarioAut;
        
        next();
    } catch (error) {
        /* console.log(error); */
        res.status(401).json({
            msg:'Token no válido'
        });
    }


}


module.exports={
    validarJWT
}