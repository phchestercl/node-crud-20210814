const { response, request } = require('express');
const Categoria = require('../models/categoria');




/* const postCategoria */

const crearCategoria = async (req,res=response)=>{
    
    const { nombre }= req.body;
    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${nombre} ya existe`
        });
    }
    // generar data a guardar
    const data = { 
        nombre,
        usuario:req.usuarioAut._id
    };
    console.log(data);
    const categoria = new Categoria(data);
    //Guardar DB
    await categoria.save();

    res.status(201).json({
        msg:`Categoria ${nombre} creada con exito`
    });
}



const obtenerCategotia = async (req=request, res=response)=>{
    const {id}=req.params;
    try {
        const cat = await Categoria.findById(id).populate('usuario','nombre');
        const {nombre, usuario}= cat;
        const usu=usuario.nombre;
        data={nombre, usu};
        res.status(200).json({
            msg:'UNA Categoria Seleccionada',
            cat,
            data
        });
    } catch (error) {
        /* console.log(error); */
        res.status(500).json({
            msg:`Existe un error interno, no se puede mostrar la categoria con id : ${id}`
        });
        /* throw new Error('No se puede mostrar la categoria selecionada'); */
    }
}

const obtenerCategorias = async (req, res=response)=>{
    const { limite=5, desde = 0 } =req.query;
    const [total , categorias] = await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true}).populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    /* const categorias = await Categoria.find({estado:true}).populate('usuario','nombre'); */
    res.status(200).json({
        msg:"Listado de Categorias",
        total,
        categorias,

    });
};

const actualizarCategoria = async (req, res=response)=>{
    try {
        const {id,nombre}=req.body;
        const usuario=req.usuarioAut._id;
        const data={nombre, usuario};
        const categoria = await Categoria.findByIdAndUpdate(id, data);
        // const categoria = await Categoria.findByIdAndUpdate(id, data,{new:true}); para enviar el nuevo registro
        res.status(201).json({
            msg:`La categoria ${categoria.nombre} se actualizo a ${nombre}`,
            id,
    
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'No se a podido actualizar la categoria'
        });
        throw new Error('No se ha podido actualizar la categoria');
    }
}
const borrarCategoria = async (req,res=response)=>{
    try {
        const {id}=req.body;
        const categoria= await Categoria.findByIdAndUpdate(id,{estado:false});
        res.status(201).json({
            msg:`La categoria ${categoria.nombre} ha sido borrada`
        });
    } catch (error) {
        res.status(500).json({
            msg:`La categoría no pudo ser borrada`
        });
        
    }
};




module.exports={
    obtenerCategorias,
    obtenerCategotia,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}