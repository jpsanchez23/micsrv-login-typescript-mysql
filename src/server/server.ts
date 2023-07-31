import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from "../data-source";
import { validateRoles } from '../seeds/initial-seed';
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'../../.env' });

export class Server {

    app: Express;
    port: Number;
    paths: {
        auth: string,
        users: string,
        roles: string
    };

    constructor() {

        this.app = express();
        this.port = parseInt( process.env.PORT );

        this.paths = {
            auth:           '/api/v1/auth',
            users:          '/api/v1/users',
            roles:          '/api/v1/roles'
        }

        this.conectDB();

        this.middlewares();

        this.routes();
    }

    conectDB(){
        AppDataSource.initialize().then(async () => {
            console.log('Database connected');
            validateRoles();

        }).catch(error => console.log(error))
    }

    middlewares(){

        this.app.use( cors() );

        this.app.use( express.json() );

        // Public 
        //this.app.use( express.static('public'));
    }

    routes(){
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.roles, require('../routes/roles') );
        this.app.use( this.paths.users , require('../routes/users') );
        this.app.get('*', (req: Request, res: Response) => {
            res.status(404).json({msg: 'Not Found'});
        });
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}