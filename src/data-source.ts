import "reflect-metadata"

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'../../.env' });

import { DataSource } from "typeorm"
//import { EntityExample } from "./entity/Entity"

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    //entities: [Entity],
    migrations: [],
    subscribers: [],
})