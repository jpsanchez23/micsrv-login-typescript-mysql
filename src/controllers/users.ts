import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import replaceSpecialCharacters from 'replace-special-characters';
import { AppDataSource } from "../data-source";
import { User } from '../entity/User';
import { Role } from '../entity/Role';

const userRepository = AppDataSource.getTreeRepository(User);
const roleRepository = AppDataSource.getTreeRepository(Role);
const adminRoles = ['ADMIN', 'SUPERADMIN'];

export const getAll = async( req:Request, res:Response ) => {

    const { limit = 10, offset = 0, orderBy = 'id', typeOrder = 'asc' } = req.query;

    let realOrderBy:string;

    switch( orderBy.toLowerCase() ){
        case 'firstname':
            realOrderBy = 'firstName';
            break;
        case 'middlename':
            realOrderBy = 'middleName';
            break;
        case 'lastname1':
            realOrderBy = 'lastName1';
            break;
        case 'lastname2':
            realOrderBy = 'lastName2';
            break;
        case 'email':
            realOrderBy = 'email';
            break;
        case 'status':
            realOrderBy = 'status';
            break;
        default:
            realOrderBy = 'id';
            break;
    }

    const realTypeOrder = ( typeOrder.toLowerCase() == 'asc' || typeOrder.toLowerCase() == 'desc' ) ? typeOrder.toLowerCase() : 'asc';

    const showRoles = (adminRoles.includes(req.user.role.name)) ? true : false;

    const query = {
        select:{
            id: true,
            firstName: true,
            middleName: true,
            lastName1: true,
            lastName2: true,
            email: true
        },
        take: limit,
        skip: offset,
        order:{
            [realOrderBy]: realTypeOrder
        },
        where:{
            status: true
        },
        relations:{ role: showRoles }
    };

    try{
        const [ total, users ] = await Promise.all([
            userRepository.count(),
            userRepository.find(query)
        ]);

        return res.status(200).json({
            total,
            users
        });

    }catch( error ){
        console.log( error );
        return res.status(422).json({
            total: 0,
            users: []
        });
    }
}

export const getOne = async( req:Request, res:Response ) => {

    const { id } = req.params;

    try{
        const user = await userRepository.findOne({ where:{ id }, relations:{ role: true } });

        if( !user ){
            return res.status(422).json({
                user: null
            });
        }
    
        const { password, login_attempts, created_at, updated_at, userToken, ...userFind } = user;
    
        return res.status(200).json({
            user: userFind
        });

    }catch( error ){
        console.log( error );
        return res.status(422).json({
            user: null
        });
    }
}

export const store = async( req:Request, res:Response ) => {

    if( !req.user.role ){
        return res.status(401).json({
            msg: "You do not have the permissions to store this content",
            user: null
        });
    }

    if( !adminRoles.includes(req.user.role.name) ){

        return res.status(401).json({
            msg: "You do not have the permissions to store this content",
            user: null
        });
    }

    const { firstName, middleName, lastName1, lastName2, email, password, role } = req.body;

    let existRole = null;

    try{
        existRole = await roleRepository.findOneBy({ id: role });
    }catch( error ){
        console.log( error );
    }

    if( !existRole ){
        return res.status(422).json({
            msg: "Doesn't exist role with that ID",
            user: false
        });
    }

    try{
        const salt = bcryptjs.genSaltSync();

        const user = new User();
        user.userToken = uuidv4();
        user.firstName = replaceSpecialCharacters( firstName.trim() );
        user.middleName = ( middleName ) ? replaceSpecialCharacters( middleName.trim() ) : null;
        user.lastName1 = replaceSpecialCharacters( lastName1.trim() );
        user.lastName2 = ( lastName2 ) ? replaceSpecialCharacters( lastName2.trim() ) : null;
        user.email = email.trim();
        user.password = bcryptjs.hashSync( password, salt );
        user.status = true;
        user.role = existRole;
    
        await AppDataSource.manager.save(user);
    
        const newUser = {
            firstName: user.firstName,
            middleName: user.middleName,
            lastName1: user.lastName1,
            lastName2: user.lastName2,
            email: user.email,
            role: user.role
        };
    
        return res.status(201).json({
            msg: 'New user created',
            user: newUser
        });

    }catch( error ){
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to create a new user',
            user: null
        });
    }
}

export const firstLoginSuperAdmin = async( req:Request, res:Response ) => {

    try{
        const existSuperAdmin = await userRepository.findOneBy({ role: { name: 'SUPERADMIN' } });

        if( existSuperAdmin ){
            return res.status(410).json({
                msg: 'This resource is not longer available',
                user: null
            });
        }
    }catch( error ){
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to create a new user',
            user: null
        });
    }

    let role = null;

    try{
        role = await roleRepository.findOneBy({ name: 'SUPERADMIN' });
    }catch( error ){
        console.log( error );
    }

    if( !role ){
        return res.status(422).json({
            msg: "Doesn't exist a superadmin role",
            user: false
        });
    }

    const { firstName, middleName, lastName1, lastName2, email, password } = req.body;

    try{
        const salt = bcryptjs.genSaltSync();

        const user = new User();
        user.userToken = uuidv4();
        user.firstName = replaceSpecialCharacters( firstName.trim() );
        user.middleName = ( middleName ) ? replaceSpecialCharacters( middleName.trim() ) : null;
        user.lastName1 = replaceSpecialCharacters( lastName1.trim() );
        user.lastName2 = ( lastName2 ) ? replaceSpecialCharacters( lastName2.trim() ) : null;
        user.email = email.trim();
        user.password = bcryptjs.hashSync( password, salt );
        user.status = true;
        user.role = role;
    
        await AppDataSource.manager.save(user);
    
        return res.status(201).json({
            msg: 'New Superadmin user created',
            user
        });

    }catch( error ){
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to create a new user',
            user: null
        });
    }
}

export const firstLoginAdmin = async( req:Request, res:Response ) => {

    try{
        const existAdmin = await userRepository.findOneBy({ role: { name: 'ADMIN' } });

        if( existAdmin ){
            return res.status(410).json({
                msg: 'This resource is not longer available',
                user: null
            });
        }
    }catch( error ){
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to create a new user',
            user: null
        });
    }

    let role = null;

    try {
        role = await roleRepository.findOneBy({ name: 'ADMIN' });
    } catch (error) {
        console.log( error );
    }

    if( !role ){
        return res.status(422).json({
            msg: "Doesn't exist an admin role",
            user: false
        });
    }

    const { firstName, middleName, lastName1, lastName2, email, password } = req.body;

    try {
        const salt = bcryptjs.genSaltSync();

        const user = new User();
        user.userToken = uuidv4();
        user.firstName = replaceSpecialCharacters( firstName.trim() );
        user.middleName = ( middleName ) ? replaceSpecialCharacters( middleName.trim() ) : null;
        user.lastName1 = replaceSpecialCharacters( lastName1.trim() );
        user.lastName2 = ( lastName2 ) ? replaceSpecialCharacters( lastName2.trim() ) : null;
        user.email = email.trim();
        user.password = bcryptjs.hashSync( password, salt );
        user.status = true;
        user.role = role;

        await AppDataSource.manager.save(user);

        return res.status(201).json({
            msg: 'New Admin user created',
            user
        });

    } catch (error) {
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to create a new user',
            user: null
        });
    }
}

export const update = async( req:Request, res:Response ) => {

    const { id } = req.params;
    
    if( req.user.id != id ){
        if( !req.user.role ){
            return res.status(401).json({
                msg: "You do not have the permissions to update this content",
                user: null
            });
        }

        if( !adminRoles.includes(req.user.role.name) ){

            return res.status(401).json({
                msg: "You do not have the permissions to update this content",
                user: null
            });
        }
    }

    let user = null;

    try {
        user = await userRepository.findOne({ where:{ id }, relations:{ role: true } });
    } catch (error) {
        console.log( error );
    }

    if( !user ){
        return res.status(422).json({
            msg: "Non-existent user",
            user: null
        });
    }

    if( req.body.role ){

        let role = null;

        try {
            role = await roleRepository.findOneBy({ id: req.body.role });
        } catch (error) {
            console.log( error );
        }

        if( !role ){
            return res.status(422).json({
                msg: "Doesn't exist role with that ID"
            });
        }

        if( role.id != req.body.role ){
            user.role = role;
        }
    }

    try {
        const salt = bcryptjs.genSaltSync();

        user.firstName  = ( req.body.firstName )    ? replaceSpecialCharacters( req.body.firstName.trim() )     : user.firstName;
        user.middleName = ( req.body.middleName )   ? replaceSpecialCharacters( req.body.middleName.trim() )    : user.middleName;
        user.lastName1  = ( req.body.lastName1 )    ? replaceSpecialCharacters( req.body.lastName1.trim() )     : user.lastName1;
        user.lastName2  = ( req.body.lastName2 )    ? replaceSpecialCharacters( req.body.lastName2.trim() )     : user.lastName2;
        user.email      = ( req.body.email )        ? req.body.email.trim()                                     : user.email;
        user.password   = ( req.body.password )     ? bcryptjs.hashSync( req.body.password, salt )              : user.password;
        user.status     = ( req.body.status )       ? req.body.status                                           : user.status;
        
        await userRepository.save(user);

        const { password, login_attempts, created_at, updated_at, userToken,  ...updated } = user;

        return res.status(200).json({
            msg: 'User updated',
            user: updated
        });

    } catch (error) {
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to update user',
            user: null
        });
    }
}

export const deleteOne = async( req:Request, res:Response ) => {

    const { id } = req.params;

    if( req.user.id != id ){
        if( !req.user.role ){
            return res.status(401).json({
                msg: "You do not have the permissions to update this content",
                user: null
            });
        }

        if( !adminRoles.includes(req.user.role.name) ){

            return res.status(401).json({
                msg: "You do not have the permissions to update this content",
                user: null
            });
        }
    }

    try {
        const user = await userRepository.findOne({ where:{ id }, relations:{ role: true } });
        user.status = false;
        await userRepository.save(user);

        const { password, login_attempts, created_at, updated_at, userToken, role, ...deleted } = user;

        return res.status(200).json({
            msg: 'User deleted',
            user: deleted
        });
    } catch (error) {
        console.log( error );

        return res.status(409).json({
            msg: 'Unable to delete user',
            user: null
        });
    }
}