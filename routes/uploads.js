const {Router}=require('express');
const { check}=require('express-validator');
const { cargarArchivo } = require('../controllers/uploads');
const router = require('./auth');


router.post('/', cargarArchivo);

module.exports=router;