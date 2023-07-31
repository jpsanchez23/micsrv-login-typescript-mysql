import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { generateJTW } from '../helpers/generate-jwt';
import { AppDataSource } from "../data-source";

import { User } from '../entity/User';
const userRepository = AppDataSource.getTreeRepository(User);

export const login = async( req:Request, res:Response ) => {

    const { email, password } = req.body;

    try{
        const user = await userRepository.findOne({ where:{ email }, relations:{ role: true } });

        if( !user ){
            return res.status(400).json({
                login: false,
                msg: 'Your username is not registered'
            });
        }

        if( !user.status ){
            return res.status(400).json({
                login: false,
                msg: 'Deactivated user. Contact the administrator'
            });
        }

        if( user.login_attempts > 2 ){
            
            user.status = false;
            await userRepository.save(user);
            
            return res.status(400).json({
                login: false,
                msg: 'Maximum login attempts allowed. Contact the administrator'
            });
        }

        const validPassword = bcryptjs.compareSync( password, user.password );

        if( !validPassword ){
            const attemps = user.login_attempts + 1;
            const attempsLeft = 3 - attemps;

            user.login_attempts = attemps
            await userRepository.save(user);

            let message = ( attempsLeft == 0 ) ? 'Maximum login attempts allowed. Contact the administrator' : 'Invalid password. You have ' + attempsLeft + ' attempts remaining';

            return res.status(400).json({
                login: false,
                msg: message
            });
        }

        const token = await generateJTW( user.userToken );

        user.login_attempts = 0;
        await userRepository.save(user);

        return res.status(200).json({
            login: true,
            token
        });

    }catch( error ){
        console.log(error);

        return res.status(500).json({
            msg: 'An error has occurred. Contact the administrator'
        });
    }
}

export const validateExternalJwt = ( req:Request, res:Response ) => {
    return res.status(200).json({
        user: req.user
    });
}