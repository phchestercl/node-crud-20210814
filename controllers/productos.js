const {request, response}=require('express');
const Producto=require('../models/producto');

const crearProducto = async(req,res=response)=>{
    try {
        const {estado,__v,_id,usuario,...data}=req.body;
        console.log(data);
        //geneara datos para guardar
        data.usuario=req.usuarioAut._id;
        console.log('Valor de descripcion');
        console.log(data.descripcion);
        if(!data.descripcion){
            data.descripcion=null;
        }
        console.log('data antes de crear producto');
        console.log(data);
        const producto = new Producto(data);
        await producto.save();
        res.status(200).json({
            msg:'Producto creado',
            producto
        });
    } catch (error) {
        res.status(500).json({
            msg:'No se podido crear el producto'
        })
        throw new Error('No se a podido crear el producto');
    }
};

const obtenerProducto= async(req,res=response)=>{
    const { id }=req.params;
    try {
        const prod = await Producto.findById(id)
                        .populate('usuario','nombre')
                        .populate('categoria','nombre')
                        ;
        res.status(200).json({
            msg:`muestra producto`,
            prod
        })
    } catch (error) {
        res.status(500).json({
            msg:`No se pudo obtener el producto ${error}`
        });

    }
};


const obtenerProductos= async (req,res=response)=>{
    const { limite=5, desde =0} =req.query;
    if (isNaN(limite)){limite=5};
    if (isNaN(desde)) {desde=0};

    
    const [total , prods] = await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
                                .skip(Number(desde))
                                .limit(Number(limite))]
    );
    res.status(200).json({
        msg:'Listado de Productos',
        total,
        prods
    });
};

const actualizarProducto=async(req,res=response)=>{
    const { id, nombre, precio, categoria, descripcion, disponible} = req.body;
    const data={};
    if (nombre) { data.nombre=nombre};
    if (precio) {data.precio=precio};
    if (categoria) {data.categoria=categoria};
    if (descripcion) {data.descripcion=descripcion};
    if (disponible) { data.disponible=disponible};
    console.log(req.usuarioAut._id);
    data.usuario=req.usuarioAut._id;
    const prod = await Producto.findByIdAndUpdate(id,data,{new:true});
    console.log(data);
    res.status(200).json({
        msg:'Actualiza producto',
    })
};

const borrarProducto=async(req,res=response)=>{
    const {id}=req.body;
    const producto= await Producto.findByIdAndUpdate(id,{estado:false});
    res.status(201).json({
        msg:'Producto borrado',
        producto
    })
};

module.exports={
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto,
}
