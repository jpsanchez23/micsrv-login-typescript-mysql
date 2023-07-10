import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from "../data-source";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'../../.env' });

export class Server {

    app: Express;
    port: Number;
    paths: {
        ruta: String
    };

    constructor() {

        this.app = express();
        this.port = parseInt( process.env.PORT );

        this.paths = {
            ruta:          '/api/v1/ruta'
        }

        //conexión db
        this.conectarDB();

        //middlewares
        this.middlewares();

        //routes
        this.routes();
    }

    conectarDB(){
        AppDataSource.initialize().then(async () => {
            console.log('Conectado a base de datos');

        }).catch(error => console.log(error))
    }

    middlewares(){

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // directorio publico
        //this.app.use( express.static('public'));
    }

    routes(){
        this.app.use( this.paths.ruta , require('../routes/ruta') );
        this.app.get('*', (req: Request, res: Response) => {
            res.status(404).json({msg: 'Express + TypeScript Server'});
        });
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Sevidor corriendo en puerto', this.port);
        });
    }
}