"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../classes/token");
const authentication_1 = require("../middlewares/authentication");
const userRoutes = express_1.Router();
// login
userRoutes.post('/login', (req, resp) => {
    // console.log('request', req);
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
            const tokenUser = token_1.Token.getJwtToken({
                _id: userDb._id,
                name: userDb.name,
                email: userDb.email,
                avatar: userDb.avatar
            });
            return resp.json({
                ok: true,
                token: tokenUser
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
    // console.log('req' , req);
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    user_1.User.create(user).then(userDb => {
        const tokenUser = token_1.Token.getJwtToken({
            _id: userDb._id,
            name: userDb.name,
            email: userDb.email,
            avatar: userDb.avatar
        });
        return res.json({
            ok: true,
            token: tokenUser
        });
    }).catch((err) => {
        res.json({
            ok: false,
            user: err
        });
    });
});
userRoutes.post('/update', authentication_1.verifyToken, (req, res) => {
    // console.log('request from route', req.user);
    // console.log('request from route test', req.body.user);
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        // password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar || req.user.avatar
    };
    user_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDb) => {
        if (err)
            throw err;
        if (!userDb) {
            res.json({
                ok: false,
                message: 'No existe el usuario '
            });
        }
        else {
            const tokenUser = token_1.Token.getJwtToken({
                _id: userDb._id,
                name: userDb.name,
                email: userDb.email,
                avatar: userDb.avatar
            });
            res.json({
                ok: true,
                message: tokenUser
            });
        }
    });
});
userRoutes.get('/test2', (req, res) => {
    res.json({
        ok: false,
        message: 'all wrong'
    });
});
exports.default = userRoutes;
