import { Router, Request, Response} from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { Token } from '../classes/token';
import { verifyToken } from '../middlewares/authentication';

const userRoutes = Router();

// login
userRoutes.post('/login', (req, resp) =>{
    // console.log('request', req);
    const body = req.body;
    User.findOne({email: body.email}, (err, userDb) =>{
        if(err) throw err;

        if( !userDb ) {
            return resp.json({
                ok: false,
                message: 'Invalid User/Password'
            })
        }

        if (userDb.comparePassword(body.password)) {

            const tokenUser = Token.getJwtToken({
                _id: userDb._id,
                name: userDb.name,
                email: userDb.email,
                avatar: userDb.avatar
            });

            return resp.json({
                ok: true,
                token: tokenUser
            });
        } else {
            return resp.json({
                ok: false,
                message: 'Invalid User/Password **'
            })
        }

    })
});

userRoutes.post('/create', (req: Request, res: Response)=>{
    // console.log('req' , req);
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    User.create(user).then( userDb => {

        const tokenUser = Token.getJwtToken({
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
        })
    }) ;


});

userRoutes.post('/update', verifyToken , (req: any, res: Response)=>{
    // console.log('request from route', req.user);
    // console.log('request from route test', req.body.user);
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        // password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar || req.user.avatar
    }

    User.findByIdAndUpdate(req.user._id, user, { new: true} , (err, userDb) => {
        if (err) throw err;
        if (!userDb) {
            res.json({
                ok: false,
                message: 'No existe el usuario '
            });
        } else {
            const tokenUser = Token.getJwtToken({
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
    })

});

userRoutes.get('/test2', (req: Request, res: Response)=>{
    res.json({
        ok: false,
        message: 'all wrong'
    })
});

userRoutes.get('/', [verifyToken], (req: any, res: Response) =>{
    const user = req.user;
    res.json({
        ok: true,
        user: user
    })
});

export default userRoutes;
