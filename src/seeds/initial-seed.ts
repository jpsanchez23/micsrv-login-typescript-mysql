import { AppDataSource } from "../data-source";
import { Role } from '../entity/Role';

const roleRepository = AppDataSource.getTreeRepository(Role);

export const validateRoles = async() =>{

    const existSuperAdmin = await roleRepository.findOneBy({ name: 'SUPERADMIN' });
    const existAdmin = await roleRepository.findOneBy({ name: 'ADMIN' });

    if( !existSuperAdmin ){
        const role = new Role();
        role.name = 'SUPERADMIN';
        role.status = true;
        await AppDataSource.manager.save(role);
    }

    if( !existAdmin ){
        const role = new Role();
        role.name = 'ADMIN';
        role.status = true;
        await AppDataSource.manager.save(role);
    }
}