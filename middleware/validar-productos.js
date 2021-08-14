const { response } = require("express");
const mongoose=require('mongoose');

const { existeCategoriaID, existeNombreProducto } = require("../helpers/db-validators");
const { Producto } = require("../models");


const tienePrecio = (req, res = response, next) => {
    const { precio } = req.body;
    if (precio && isNaN(precio)) {
        return res.status(400).json({
            msg: "El precio tiene que ser un valor numerico"
        });
    };
    if (!precio) {
        req.body.precio = 0;
    }
    next();
}
const validaActProducto = async (req, res = response, next) => {
    console.log('Entro en la validacion de producto');
    let valResult=true;
    msg='';
    const { id, categoria, nombre, disponible  } = req.body;
    // si biene una categoria valida mongo, que exista
    if (categoria) {
        console.log('trae datos de categoria');
        console.log(categoria);
        // es un id de mongo?
        if(!mongoose.Types.ObjectId.isValid(categoria)){
            console.log('ID no válido');
            valResult=false;
            msg='No es un ID de categoria válido';
        } else {
            console.log('es un id valido, revisa si no existe la categori');
            console.log(await existeCategoriaID(categoria));
            if (await existeCategoriaID(categoria)===false) {
                valResult=false;
                msg='La categoria no existe';
            }
        }
    }
    //valida si el nombre del producto ya existe con otro ID
    if(nombre){
        /* try { */
            const prd=await Producto.findOne({nombre});

            if (prd){
                if(id!=prd._id){
                    msg=`Ya existe otro producto con ese nombre : ${prd._id}`;
                    valResult=false;
                }
            }
        /* } catch (error) {
            console.log('nombre no encontrado');
            console.log(error)
        } */
    }
    if (typeof disponible!=='undefined'){
        if(typeof disponible!=="boolean"){
            valResult=false;
            msg='El valor de disponible debe ser un valor booleano'
        }
    }
    if (!valResult){
        return res.status(401).json({
            msg
        })
    }
    next();
}
module.exports = {
    tienePrecio,
    validaActProducto
}