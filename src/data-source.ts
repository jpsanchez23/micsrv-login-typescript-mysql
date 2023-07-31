import "reflect-metadata"

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'../../.env' });

import { DataSource } from "typeorm";
import { entities } from "./entity";
import { migrations } from "./migrations";

const db_type:any = process.env.DB_TYPE.toString();

export const AppDataSource = new DataSource({
    type: db_type,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: entities,
    migrations: migrations,
    subscribers: []
})