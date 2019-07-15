"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../classes/token");
exports.verifyToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.Token.compareToken(userToken).then((decoded) => {
        // console.log('Decoded', decoded);
        // console.log('req', req.user)
        req.user = decoded.user;
        next();
    }).catch((err) => {
        res.json({
            ok: false,
            message: 'Invalid Token'
        });
    });
};
