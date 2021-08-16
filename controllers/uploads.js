const fs = require('fs');
const path = require('path');

const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models')
const cloudinary = require('cloudinary').v2;


const cargarArchivo = async (req, res = response) => {

    /* console.log('req.files >>>', req.files); // eslint-disable-line */
    try {
        const resol = await subirArchivo(req.files, ['webp'], 'imgs/', ['image/webp']);
        res.status(200).json({
            resol
        })
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }
};
const actualizarImagen = async (req, res = response) => {
    const { coleccion, id } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de usuario no existe'
                })
            };

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de producto no existe'
                })
            };
            break;
        default:
            return res.status(500).json({
                msg: 'Coleccion no valida'
            })
            break;
    }
    //LIMPIAR IMAGENES PREVIAS
    if (modelo.img) {              //Exsite img en el modelo
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        /* console.log(pathImagen); */
        if (fs.existsSync(pathImagen)) {
            fs.unlink(pathImagen, err => {
                if (err) {
                    throw err
                }
            });
        }

    }
    const nombre = await subirArchivo(req.files, undefined, `${coleccion}/`, undefined);
    modelo.img = nombre;
    await modelo.save()

    res.status(200).json({
        msg: 'imagen cargada',
        coleccion,
        id,
        modelo
    })

}
const mostrarImagen = async (req, res = response) => {
    const { coleccion, id } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de usuario no existe'
                })
            };

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de producto no existe'
                })
            };
            break;
        default:
            return res.status(500).json({
                msg: 'Coleccion no valida'
            })
            break;
    }
    //Exsite la imagen
    if (modelo.img) {              //Exsite img en el modelo
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        /* console.log(pathImagen); */
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }
    res.sendFile(path.join(__dirname,'../assets','no-image.jpg'))
}

//Upload en Cloudinary

const actualizarImagenCloudinary = async (req, res = response) => {
    const { coleccion, id } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de usuario no existe'
                })
            };
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de producto no existe'
                })
            };
            break;
        default:
            return res.status(500).json({
                msg: 'Coleccion no valida'
            })
            break;
    }
    //LIMPIAR IMAGENES PREVIAS EN CLOUDINARY
    if (modelo.img) {              //Exsite img en el modelo
        //si la direccion yha exsiste se tiene que eliminar
        const nombreArchivo = modelo.img.split('/');
        const nombre=nombreArchivo[nombreArchivo.length -1 ];
        const [public_id]=nombre.split('.')
        console.log(public_id);
        cloudinary.uploader.destroy(public_id);

    }
    const {tempFilePath} = req.files.archivo;
    const {secure_url} =await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save()
    res.status(200).json({
        msg: 'imagen cargada',
        coleccion,
        id,
        modelo
    })

};

const mostrarImagenCloudinary = async (req,res=response)=>{
    const { coleccion, id } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de usuario no existe'
                })
            };

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: 'El id de producto no existe'
                })
            };
            break;
        default:
            return res.status(500).json({
                msg: 'Coleccion no valida'
            })
            break;
    }
    res.redirect(modelo.img);
    /* res.status(200).json({
        msg: 'imagen cargada',
        coleccion,
        id,
        url:modelo.img
    }); */
}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary

}