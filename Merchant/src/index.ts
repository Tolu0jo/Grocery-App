import express from 'express';
import { dbConnection } from './repository/db';
import { PORT } from './config';
import { expressApp } from './express-app';
import { CreateChannel } from './utils';
const startServer = async ()=>{
const app = express();

await dbConnection();

const channel = await CreateChannel()

await expressApp(app, channel)

app.listen(PORT,()=>{
    console.log("Admin server listening on " + PORT + "...");
})
}
startServer()
