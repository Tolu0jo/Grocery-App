import express from 'express';
import { PORT } from './config';
import { dbConnection } from './database';
import { expressApp } from './express-app';
import { CreateChannel } from './utils';

const StartServer =async ()=>{
    const app = express();

    await dbConnection()
     
    const channel=await CreateChannel()

    await expressApp(app, channel)

    app.listen(PORT, () => {
        console.log("Product listening on port " + PORT);
      }).on('error',(err)=>{
        console.log(err);
        process.exit(1);
      });
}

StartServer()