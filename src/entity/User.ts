import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import { Role } from './Role';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    userToken: string;

    @Column({ type: 'varchar', nullable: false })
    firstName: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    middleName: string;

    @Column({ type: 'varchar', nullable: false })
    lastName1: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    lastName2: string;

    @Column({ type: 'varchar', nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'boolean', default: false, nullable: false })
    status: boolean;

    @Column({ type: 'integer', default: 0, nullable: false })
    login_attempts: number;

    @ManyToOne( () => Role, role => role.users )
    role: Role;

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
}
