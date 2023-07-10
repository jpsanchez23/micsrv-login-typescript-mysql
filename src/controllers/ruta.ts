import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { EntityExample } from '../entity/Entity';

const entityRepository = AppDataSource.getTreeRepository(EntityExample);

export const getAll = async( req:Request, res:Response ) =>{
    
    return res.status(200).json({
        msg: 'getAll'
    });
}

export const getOne = async( req:Request, res:Response ) =>{

    return res.status(200).json({
        msg: 'getOne'
    });
}

export const store = async( req:Request, res:Response ) =>{

    return res.status(201).json({
        msg: 'store'
    });
}

export const update = async( req:Request, res:Response ) =>{

    return res.status(200).json({
        msg: 'update'
    });
}

export const deleteOne = async( req:Request, res:Response ) =>{

    return res.status(204).json({
        msg: 'deleteOne'
    });
}
