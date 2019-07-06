import { Response, NextFunction } from 'express';
import { Token } from '../classes/token';

export const verifyToken = ( req:any, res:Response, next:NextFunction ) => {

    const userToken = req.get('x-token') || '';

    Token.compareToken(userToken).then( (decoded:any) => {
        console.log('Decoded', decoded);
        console.log('req', req.user)
        req.user = decoded.user;
        next();
    }).catch((err)=> {

        res.json({
            ok: false,
            message: 'Invalid Token'
        });

    });

}