import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'../../.env' });

export const generateJTW = ( userToken:string = '' ) =>{
    return new Promise( (resolve, reject) =>{

        const payload = { userToken };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '4h' }, ( err, token ) => {

            if( err ){
                console.log(err);

            }else{
                resolve(token);
            }
        });
    });
}