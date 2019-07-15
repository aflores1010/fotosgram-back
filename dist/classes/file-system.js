"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() {
    }
    saveTempImage(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.createUserFile(userId);
            //nombre del archivo
            const fileName = this.generateFileName(file.name);
            // mover el archivo a la carpeta
            file.mv(path + '/' + fileName, (err) => {
                if (err) {
                    // no se pudo mover
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generateFileName(originalName) {
        // extrayendo la extension
        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];
        const uniqueId = uniqid_1.default();
        return uniqueId + '.' + extension;
    }
    createUserFile(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        console.log('path', pathUser);
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    moveImageToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const tempImages = this.getTempImages(pathTemp);
        tempImages.forEach(function (image) {
            fs_1.default.renameSync(pathTemp + '/' + image, pathPost + '/' + image);
        });
        return tempImages;
    }
    getTempImages(pathTemp) {
        return fs_1.default.readdirSync(pathTemp) || [];
    }
}
exports.FileSystem = FileSystem;
