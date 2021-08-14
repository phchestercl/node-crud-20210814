const express = require('express');
const cors = require('cors');

const { dbConnection }=require('../database/config')
class Server{
    constructor(){
        this.app = express();
        this.port=process.env.PORT;
        /* this.userPath='/api/users';
        this.autPath='/api/auth';
        this.categoryPath='/api/categorias'; */
        this.paths={
            auth:'/api/auth',
            categorias:'/api/categorias',
            user:'/api/users',
            productos:'/api/productos',
            buscar:'/api/buscar'
        }
        // conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        // Rutas de mi aplicacion
        this.routes();
        
    };
    async conectarDB(){
        await dbConnection();
    };
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos,require('../routes/productos'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
                
    };
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
        })
    };
    middlewares(){
        //CORS
        this.app.use( cors());
        // Lectura y parseo del body
        /**
         * Este midellware permite recivir información de los post y put
         */
        this.app.use(express.json());
        // Directorio publico
        this.app.use( express.static('public'));
    }
};


module.exports=Server;