import { FileUploadInterface } from "../interfaces/file-upload.interface";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export class FileSystem {

    constructor() {

    }

    saveTempImage(file: FileUploadInterface, userId: string) {

        return new Promise((resolve, reject)=> {
            const path = this.createUserFile(userId);

            //nombre del archivo
            const fileName = this.generateFileName(file.name);
    
            // mover el archivo a la carpeta
            file.mv( path + '/' + fileName, (err: any) =>{
                if (err) {
                    // no se pudo mover
                    reject(err);
                } else {
                    resolve();
                }
            })
        }); 
    }

    private generateFileName( originalName: string) { // 6.copy.jpg
        // extrayendo la extension
        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];

        const uniqueId = uniqid();
        return uniqueId + '.' + extension;
    }

    private createUserFile( userId: string ) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        console.log('path', pathUser);

        const exist = fs.existsSync(pathUser);
        if (!exist) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;

    }

    public moveImageToPost(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if( !fs.existsSync(pathTemp) ) {
            return [];
        }

        if( !fs.existsSync(pathPost) ) {
            fs.mkdirSync(pathPost)
        }

        const tempImages = this.getTempImages( pathTemp);

        tempImages.forEach( function(image){
            fs.renameSync(pathTemp + '/' + image, pathPost + '/' + image)
        });

        return tempImages;

    }

    private getTempImages(pathTemp: string) {

        return fs.readdirSync(pathTemp) || [];

    }


   public getImageUrl(userId: string, img: string) {
       // path de los post

       const pathPhoto = path.resolve(__dirname, '../uploads/', userId , 'posts',  img);
       // verificAR SI imagen existe
       const exist = fs.existsSync(pathPhoto);
       if (!exist) {
           // retornar imagen por defecto que debe estar almacenada en assets
           return path.resolve(__dirname, '../assets/no-image.jpg');
       }
       // return del path foto
       return pathPhoto;
   }

}