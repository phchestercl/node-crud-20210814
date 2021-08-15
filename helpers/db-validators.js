const { Producto } = require('../models');
const Categoria = require('../models/categoria');

const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(role = '')=>{
    const existeRole = await Role.findOne({role});
    if (!existeRole) {
        throw new Error('El Rol no está regsitrado en la base de datos');
    }
};
const existeUsuarioPorID = async (id)=>{
    const existeUsID = await Usuario.findById(id);
    if (!existeUsID){
        throw new Error('No existe usuario para el ID ingresado');
    }
};
const existeMail = async (correo='')=>{
    const existeCorreo = await Usuario.findOne({correo});
    
    if (existeCorreo) {
        throw new Error(`El Correo ${correo} ya está registrado`);
    }
};
const existeCategoriaID = async (id)=>{
    const exCatID=await Categoria.findById(id);
    if (!exCatID||exCatID.estado===false){
        return false;
        throw new Error(`La categoria ${id} no existe`);
    }
    return true;
};
const existeNombreProducto =async (nombre)=>{
    
    try {
        const nom = await Producto.findOne({nombre});
        console.log('el valor de nom es :');
        console.log(nom);
        if(!nom){
            throw new Error('El nombre del producto no existe');
        }
    } catch (error) {
        throw new Error('Error al obtener información del producto');
    }
};
const noExisteNombreProducto = async (nombre)=>{
    const nom = await Producto.findOne({nombre});
        /* console.log('el valor de nom es :');
        console.log(nom); */
        if(nom){
            throw new Error(`El nombre del producto ${nombre} ya existe`);
        }
}
const existeProductoID=async (id)=>{
    const idProd=await Producto.findById(id);
    if (!idProd||idProd.estado===false){
        throw new Error('No existen productos con el id proporcionado');
    }
}
/**
 * Valida la
 */
const colecionesPermitidas=(coleccion='', colecciones=[])=>{
       
    const incluida = colecciones.includes(coleccion);
    if (!incluida){
        throw Error(`La coleccion ${coleccion} no está permitida`);
    }
    return true;
}
module.exports={
    esRolValido,
    existeMail,
    existeUsuarioPorID,
    existeCategoriaID,
    existeNombreProducto,
    noExisteNombreProducto,
    existeProductoID,
    colecionesPermitidas

}


