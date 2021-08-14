const { response }=require('express');
const {ObjectId} = require('mongoose').Types;
const {Usuario, Categoria, Producto} = require('../models');

const colecionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];
const buscarUsuario =async (termino='', res=response )=>{
    const esMongoID=ObjectId.isValid(termino);
    if (esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            msg:'usuario encontrado',
            results: (usuario)?[usuario]:[]            
        });
    }
    // verificar e nombre o el correo en el termino
    const regex=new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });
    return res.status(200).json({
        msg:'usuarios encontrados',
        registros:(usuarios)?usuarios.length:0,
        results: (usuarios)?usuarios:[],
    });
};
const buscarCategorias = async (termino='', res=response)=>{
    const esMongoID=ObjectId.isValid(termino);
    if (esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            msg:"Categoria Encontrada",
            registros:(categoria)?1:0,
            results:(categoria)?[categoria]:[],
        });
    }
    const regex =new RegExp(termino,'i');
    const categorias = await Categoria.find({nombre:regex, estado:true });
    res.status(200).json({
        msg:"Categoria Encontrada",
        registros:(categorias)?categorias.length:0,
        results:(categorias)?categorias:[],
    });
}
const buscarProductos = async (termino='',res=response)=>{
    const isMongoID=ObjectId.isValid(termino);
    if (isMongoID) {
        const producto = await Producto.findById(termino);
        return res.status(200).json({
            msg:"Producto Encontrado",
            registros:(producto)?1:0,
            results:(producto)?[producto]:[],
        });
    }
    const regex = new RegExp(termino,'i');
    const productos = await Producto.find({
        $or:[{nombre:regex},{descripcion:regex}],
        $and:[{estado:true}]
    })
    res.status(200).json({
        msg:"Productos Encontrados",
        registros:(productos)?productos.length:0,
        results:(productos)?productos:[],
    });
}
const buscar = async (req, res=response)=>{
    const { coleccion, termino}=req.params;
//Valida las colecciones permitidas
    if (!colecionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg:`Las coleciones permitidas son ${colecionesPermitidas.toString()}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            console.log('entro a usuario y deberia llamar a buscar usuario');
            buscarUsuario(termino,res);

            break;
        case 'categorias':
            buscarCategorias(termino, res);

            break;
        case 'productos':
            buscarProductos(termino,res);

            break;

        default:
            res.status(500).json({
                msg:'No hay opcion de busqueda valida'
            })
            break;
    }
    /* res.status(200).json({
        msg:'busqueda',
        coleccion,
        termino
    }) */
}


module.exports={
    buscar
}