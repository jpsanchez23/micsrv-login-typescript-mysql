import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../data-source";

import { User } from '../entity/User';
const userRepository = AppDataSource.getTreeRepository(User);

export const validateJTW = async( req:Request, res:Response, next: () => void ) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'There is no token in request'
        });
    }

    try{
        interface JwtPayload {
            userToken: string
        };

        const { userToken } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ) as JwtPayload;
        const user = await userRepository.findOne({ where:{ userToken }, relations:{ role: true } });

        if( !user ){
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }

        if( !user.status ){
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }

        const { email, password, status, login_attempts, created_at, updated_at, ...userVerify } = user;

        req.user = userVerify;
        
        next();

    }catch( error ){
        console.log( 'error name:', error.name );
        console.log( 'error message:', error.message );

        return res.status(401).json({
            msg: 'Invalid token'
        });
    }
}