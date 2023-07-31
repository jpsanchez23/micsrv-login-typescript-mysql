import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { Role } from '../entity/Role';

const roleRepository = AppDataSource.getTreeRepository(Role);
const adminRoles = ['ADMIN', 'SUPERADMIN'];

export const getAll = async( req:Request, res:Response ) =>{

    const { limit = 10, offset = 0 } = req.query;

    try {
        const [ total, roles ] = await Promise.all([
            roleRepository.count(),
            roleRepository.find({take: limit, skip: offset})
        ]);
        
        return res.status(200).json({
            total,
            roles
        });

    } catch (error) {
        console.log( error );
        return res.status(422).json({
            total: 0,
            roles: []
        });
    }
}

export const getOne = async( req:Request, res:Response ) =>{

    const { id } = req.params;

    if( req.user.id != id ){
        if( !req.user.role ){
            return res.status(401).json({
                msg: "You do not have the permissions to view this content"
            });
        }

        if( !adminRoles.includes(req.user.role.name) ){

            return res.status(401).json({
                msg: "You do not have the permissions to view this content"
            });
        }
    }

    let role = null;

    try {
        role = await roleRepository.findOneBy({ id });
    } catch (error) {
        console.log( error );
    }

    if( !role ){
        return res.status(422).json({
            msg: "Doesn't existe role with that ID"
        });
    }

    return res.status(200).json({
        role
    });
}

export const store = async( req:Request, res:Response ) =>{

    let { name, status } = req.body;

    name = name.toUpperCase().trim().replace(/[\W_]/g, '');

    try {
        const existOne = await roleRepository.findOneBy({ name }); 

        if( existOne ){
            return res.status(403).json({
                msg: 'Already exist a role with that name'
            });
        }
    } catch (error) {
        console.log( error );

        return res.status(500).json({
            msg: 'An error has occurred. Contact the administrator'
        });
    }

    try {
        status = Boolean(status);

        const role = new Role();
        role.name = name;
        role.status = status;

        await AppDataSource.manager.save(role);

        return res.status(201).json({
            msg: 'New role created: ' + name,
        });

    } catch (error) {
        console.log( error );

        return res.status(500).json({
            msg: 'An error has occurred. Contact the administrator'
        });
    }
}

export const update = async( req:Request, res:Response ) =>{

    const { id } = req.params;

    if( req.user.id != id ){
        if( !req.user.role ){
            return res.status(401).json({
                msg: "You do not have the permissions to update this content"
            });
        }

        if( !adminRoles.includes(req.user.role.name) ){

            return res.status(401).json({
                msg: "You do not have the permissions to update this content"
            });
        }
    }

    let role = null;

    try {
        role = await roleRepository.findOneBy({ id });
    } catch (error) {
        console.log( error );
    }

    if( !role ){
        return res.status(422).json({
            msg: "Doesn't existe role with that ID"
        });
    }

    let updated = false;
    let { name, status } = req.body;

    try {
        if( name ){
            name = name.toUpperCase().trim().replace(/[\W_]/g, '');
            role.name = name;
            updated = true;
        }
    
        if( status !== 'undefined' ){
            status = Boolean(status);
            role.status = status;
            updated = true;
        }
        
        await roleRepository.save(role);
    
        return res.status(200).json({
            role
        });

    } catch (error) {
        console.log( error );

        return res.status(500).json({
            msg: 'An error has occurred. Contact the administrator',
            role: null
        });
    }
}

export const deleteOne = async( req:Request, res:Response ) =>{

    const { id } = req.params;

    if( req.user.id != id ){
        if( !req.user.role ){
            return res.status(401).json({
                msg: "You do not have the permissions to delete this content"
            });
        }

        if( !adminRoles.includes(req.user.role.name) ){

            return res.status(401).json({
                msg: "You do not have the permissions to delete this content"
            });
        }
    }

    let role = null;

    try {
        role = await roleRepository.findOneBy({ id });
    } catch (error) {
        console.log( error );
    }

    if( !role ){
        return res.status(422).json({
            msg: "Doesn't existe role with that ID"
        });
    }

    try {
        role.status = false;
        await roleRepository.save(role);

        return res.status(204).json({
            msg: 'Role ' + role.name + ' deleted'
        });

    } catch (error) {
        console.log( error );

        return res.status(500).json({
            msg: 'An error has occurred. Contact the administrator',
            role: null
        });
    }    
}