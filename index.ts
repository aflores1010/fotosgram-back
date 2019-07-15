import { Server } from './classes/server';
import userRoutes from './routes/user';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';

const server = new Server();

// middleware Body Parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

server.app.use(fileUpload());


//rutas de la aplicacion
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);


// conectar db
mongoose.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err)=>{
    if(err){
      throw err;
    }
    console.log('Base de datos Online');
})

//levantar express
server.start(() => {
    console.log('Servidor corriendo en ', server.port);
});

