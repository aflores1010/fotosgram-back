import jwt from 'jsonwebtoken'

export class Token {

    private static seed: string = 'curso-ionic-4-seed';
    private static expires: string = '30d';

    constructor(){ }

    static getJwtToken(payload: any): string {
        return jwt.sign(
        {
          user: payload
        },
        this.seed,
        {
         expiresIn: this.expires
        });
    }

    static compareToken(userToken:string) {
        return new Promise( (resolve, reject) =>{
            jwt.verify(userToken, this.seed, ( err, decoded) => {
                if( err ) {
                    reject();
                } else {
                    resolve(decoded);
                }   
            })
        } );
    }

}