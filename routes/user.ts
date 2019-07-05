import { Router, Request, Response} from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

const userRoutes = Router();

// login
userRoutes.post('/login', (req, resp) =>{
    console.log('request', req);
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
            return resp.json({
                ok: true,
                token: 'asdkjfadskfjaskdlfafkalfjaklf'
            })
        } else {
            return resp.json({
                ok: false,
                message: 'Invalid User/Password **'
            })
        }

    })
});

userRoutes.post('/create', (req: Request, res: Response)=>{
    console.log('req' , req);
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    User.create(user).then( userDb => {
        res.json({
            ok: true,
            user: userDb
        })
    }).catch((err) => {
        res.json({
            ok: false,
            user: err
        })
    }) ;


});

userRoutes.get('/test2', (req: Request, res: Response)=>{
    res.json({
        ok: false,
        message: 'all wrong'
    })
});

export default userRoutes;
