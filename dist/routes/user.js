"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRoutes = express_1.Router();
// login
userRoutes.post('/login', (req, resp) => {
    console.log('request', req);
    const body = req.body;
    user_1.User.findOne({ email: body.email }, (err, userDb) => {
        if (err)
            throw err;
        if (!userDb) {
            return resp.json({
                ok: false,
                message: 'Invalid User/Password'
            });
        }
        if (userDb.comparePassword(body.password)) {
            return resp.json({
                ok: true,
                token: 'asdkjfadskfjaskdlfafkalfjaklf'
            });
        }
        else {
            return resp.json({
                ok: false,
                message: 'Invalid User/Password **'
            });
        }
    });
});
userRoutes.post('/create', (req, res) => {
    console.log('req', req);
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    user_1.User.create(user).then(userDb => {
        res.json({
            ok: true,
            user: userDb
        });
    }).catch((err) => {
        res.json({
            ok: false,
            user: err
        });
    });
});
userRoutes.get('/test2', (req, res) => {
    res.json({
        ok: false,
        message: 'all wrong'
    });
});
exports.default = userRoutes;
