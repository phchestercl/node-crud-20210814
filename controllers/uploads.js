const fs =require('fs');
const path = require('path');

const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto} =require('../models')



const cargarArchivo = async (req, res = response) => {
    
    /* console.log('req.files >>>', req.files); // eslint-disable-line */
    try {
        const resol = await subirArchivo(req.files,['webp'],'imgs/',['image/webp']);
        res.status(200).json({
            resol
        })
    } catch (error) {
        res.status(500).json({
            msg:error
        })
    }
};
const actualizarImagen =async (req,res=response)=>{
    const {coleccion, id} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id);
            if(!modelo){
                return res.status(500).json({
                    msg:'El id de usuario no existe'
                })
            };

            break;
        case 'productos':
            modelo=await Producto.findById(id);
            if(!modelo){
                return res.status(500).json({
                    msg:'El id de producto no existe'
                })
            };
            break;
        default:
            return res.status(500).json({
                msg:'Coleccion no valida'
            })
            break;
    }
    //LIMPIAR IMAGENES PREVIAS
    if(modelo.img){              //Exsite img en el modelo
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
        /* console.log(pathImagen); */
        if(fs.existsSync(pathImagen)){
            fs.unlink(pathImagen, err=>{
                if (err){
                    throw err
                }
            });
        }

    }
    const nombre = await subirArchivo(req.files,undefined,`${coleccion}/`,undefined);
    modelo.img=nombre;
    await modelo.save()

    res.status(200).json({
        msg:'imagen cargada',
        coleccion,
        id,
        modelo
    })

}


module.exports = {
    cargarArchivo,
    actualizarImagen

}