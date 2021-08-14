const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    /**
     * localhost:8080/api/users?q=hola&nombre=philip&apikey=1252334372
     * 
     * con la desestrucutración le podemos dar valores por defecto a nuestros parametros, asi por ejempo si no viene el nummero de página pondrá 
     * por defecto el valor de 1.
     * localhost:8080/api/users?query=hola&nombre=harry&apikey=1252334372&limit=10
     */
    /* const { query, nombre, apikey, page = 1, limit } = req.query;
    res.json({
        msg: 'get API, metodo get - CONTROLADOR',
        query,
        nombre,
        apikey,
        page,
        limit
    }) */
    
    const { limite=5, desde = 0 } =req.query;
    const query={estado:true};
    
    /* Llamar estos dos await hace que se ejecute uno primero y luego el segundo
    Es posible realizar ambas peticiones con una promesa */
    /* const usuarios = await Usuario.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite));
    const total = await Usuario.countDocuments(query);
     */

    const [total , usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    

    res.json({
        total,
        usuarios
    })
};
const usuariosPut = async (req = request, res = response) => {
    /* const id =req.params.id;  las dos formas son validas*/
    const { id } = req.params;
    const { _id,password, google, correo, ...resto} = req.body;
    // TODO contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto);



    res.json({
        usuario
    })
};
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });
    // verificar si el correo existe


    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en db

    await usuario.save();
    res.json({
        msg: 'Post api, método POST desde el contrtolador',
        usuario
    })
};
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch api, método Patch desde el contrtolador',
    })
};
const usuariosDelete = async (req, res = response) => {
    const { id }=req.params;
    // BORRADO FISICO DE UN DOCUMENTO
    // const usuario = await Usuario.findByIdAndDelete(id);
    // Borrado con cambio de estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    const usuarioAutenticado= req.usuarioAut;
    res.json({
        msg: 'Delete api, método Delete desde el contrtolador',
        id,
        usuario,
        usuarioAutenticado
    })
};






module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}