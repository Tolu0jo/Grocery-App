import express from 'express';
import { PORT } from './config';

import { expressApp } from './express-app';
import { dbConnection } from './database/connection';
import { CreateChannel } from './utils';

const StartServer =async ()=>{
    const app = express();

    await dbConnection()
    
    const channel = await CreateChannel()
    
    await expressApp(app,channel)

    app.listen(PORT, () => {
        console.log("Shopping listening on port " + PORT);
      }).on('error',(err)=>{
        console.log(err);
        process.exit(1);
      });
}
StartServer()