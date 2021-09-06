const bcryptjs = require('bcryptjs');
const { response } = require('express');
const Mail = require('nodemailer/lib/mailer');
const { generarJWT } = require('../helpers/generarjwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');
const { sendCorreo }=require('../helpers/sendmail')

const login = async (req, res=response)=>{
    
    const { correo, password }=req.body;
    try {
        // verificar si el mail existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg:'El usuario no existe en la base de datos'
            });
        }
        // verificar si el usuario esta activo
        if (!usuario.estado){
            return res.status(400).json({
                msg:'El usuario no está activo'
            });
        }
        // verificar la contraseña
        const validPassword=bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg:'la password no es la correcta'
            });
        }

        // generar JWT
        const token = await generarJWT(usuario.id);
        // enviar mail TEST
        sendCorreo()

        res.status(200).json({ 
            msg:'log ok',
            usuario,
            token

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            msg:'Algo salío mal'
        });
    }
};

const googleSignin = async (req,res=response)=>{
    const { id_token} = req.body;

    try {
        const { correo, nombre,img }= await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo});
        console.log(usuario);
        if(!usuario){
            const data={ nombre, correo, img, password:'sincontraseña', google:true}
            usuario= new Usuario(data);
            await usuario.save();
        }
        // si el usuario en BD estado:false
        if (!usuario.estado){
            res.status(401).json({
                msg:'El usuario tiene estatus de borrado'
            });

        }
        const token = await generarJWT(usuario.id);
        res.status(200).json({
            msg:"Todo ok desde el backend",
            id_token,
            usuario,
            token
            
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:'Token de Google no es válido'
        })
    }

}
module.exports={
    login,
    googleSignin
}