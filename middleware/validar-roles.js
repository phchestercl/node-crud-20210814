const { response } = require("express");
const role = require("../models/role");



const esAdminRol = (req,res = response, next)=>{
    if(!req.usuarioAut){
        return res.status(500).json({
            msg:'No existe usuario para validar'
        });
    }
    const { role, nombre } = req.usuarioAut;
    if(role!='ADMIN_ROLE') {
        return res.status(401).json({
            msg:'El usuario no tiene autorización para esta acción'
        })
    }
    next();
}
const tieneRol = (...roles )=>{
    return (req, res=response, next)=>{
        /* console.log(roles); */
        if(!req.usuarioAut){
            return res.status(500).json({
                msg:'No existe usuario para validar'
            });
        };
        /* console.log(req.usuarioAut.role) */
        if (!roles.includes(req.usuarioAut.role)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}.`
            });
        }

        next()
    }
}
module.exports={
    esAdminRol,
    tieneRol
}