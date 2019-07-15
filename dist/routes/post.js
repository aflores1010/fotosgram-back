"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const post_1 = require("../models/post");
const file_system_1 = require("../classes/file-system");
const postRoutes = express_1.Router();
postRoutes.post('/', [authentication_1.verifyToken], (req, res) => {
    const body = req.body;
    console.log('req user', req.user);
    body.user = req.user._id;
    const fileSystem = new file_system_1.FileSystem();
    const images = fileSystem.moveImageToPost(req.user._id);
    body.img = images;
    post_1.Post.create(body).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        console.log('POSTDB', postDB);
        console.log('body', body);
        yield postDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json({
            ok: false
        });
    });
});
// obteniendo post paginados
postRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_1.Post.find()
        .sort({
        _id: -1
    })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        ok: true,
        page,
        posts: posts
    });
}));
// Subir archivos
postRoutes.post('/upload', [authentication_1.verifyToken], (req, resp) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            message: 'No se subió ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return resp.status(400).json({
            ok: false,
            message: 'No se subió ningun archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return resp.status(400).json({
            ok: false,
            message: 'lo que subio no es una imagen'
        });
    }
    const fileSystem = new file_system_1.FileSystem();
    yield fileSystem.saveTempImage(file, req.user._id);
    return resp.status(200).json({
        file: file.mimetype,
        ok: true,
        message: 'ok'
    });
}));
exports.default = postRoutes;
