import { Router, Response, Request } from "express";
import { verifyToken } from "../middlewares/authentication";
import { Post } from "../models/post";
import { FileUploadInterface } from "../interfaces/file-upload.interface";
import { FileSystem } from "../classes/file-system";

const postRoutes = Router();


postRoutes.post('/', [verifyToken], (req: any, res: Response) =>{
    const body = req.body;
    console.log('req user', req.user);

    body.user = req.user._id;
    const fileSystem = new FileSystem();

    const images = fileSystem.moveImageToPost(req.user._id);
    body.img = images;
    
    Post.create(body).then( async postDB => {
        console.log('POSTDB', postDB);
        console.log('body', body);

        await postDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    }). catch(err => {
        res.json({
            ok: false
        })
    })

});


// obteniendo post paginados
postRoutes.get('/', async (req: any, res: Response) =>{
    
    let page = Number(req.query.page) || 1;
    let skip = page -1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({
                                _id: -1
                            })
                            .skip(skip)
                            .limit(10)
                            .populate('user','-password')
                            .exec();

     res.json({
            ok: true,
            page,
            posts: posts
        });

});


// Subir archivos
postRoutes.post('/upload', [verifyToken], async (req: any, resp: Response) => {
    if(!req.files) {
        return resp.status(400).json({
            ok: false,
            message: 'No se subió ningun archivo'
        })
    }

    const file: FileUploadInterface  = req.files.image;

    if(!file){
        return resp.status(400).json({
            ok: false,
            message: 'No se subió ningun archivo - image'
        })
    }

    if(!file.mimetype.includes('image')) {
        return resp.status(400).json({
            ok: false,
            message: 'lo que subio no es una imagen'
        })
    }

    const fileSystem = new FileSystem();
    await fileSystem.saveTempImage(file, req.user._id);

    return resp.status(200).json({
        file: file.mimetype,
        ok: true,
        message: 'ok'
    })
    
});

export default postRoutes;