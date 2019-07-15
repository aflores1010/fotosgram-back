"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./classes/server");
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = new server_1.Server();
// middleware Body Parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use(express_fileupload_1.default());
//rutas de la aplicacion
server.app.use('/user', user_1.default);
server.app.use('/posts', post_1.default);
// conectar db
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos Online');
});
//levantar express
server.start(() => {
    console.log('Servidor corriendo en ', server.port);
});
