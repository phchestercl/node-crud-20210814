/** modelo de la base de datos */
/* {
    "nombre":"",
    "correo":"",
    "password":"23897298379261",
    "img":"una url",
    "role":"Administrador"
    "estado":false,
    "google":true/false   
} */

const { Schema, model} = require('mongoose');
const UsuarioSchema=Schema({
    nombre:{
        type:String,
        required: [true,'El nombre es obligatorio'],

    },
    correo:{
        type:String,
        required: [true,'El correo es obligatorio'],
        unique:true                                     // no puede existir el mismo correo
    },
    password:{
        type:String,
        required: [true,'La contraseña es obligatoria'],
    },
    img:{
        type:String,
    },
    role:{
        type:String,
        default:'USER_ROLE',
        required: [true,'El nombre es obligatorio'],
        emun:['ADMIN_ROLE','USER_ROLE']             // valores permitidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false                   // true si el usuario fue creado por medio de google
    },
});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id,...usuario }=this.toObject();
    usuario.uid = _id;
    return usuario;
};

module.exports=model('Usuario',UsuarioSchema);