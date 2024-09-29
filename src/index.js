import {dbConnection} from "./db/db.connection.js";
import { app } from "./app.js";




dbConnection().
then(()=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log(`server is running at ${process.env.PORT}`)
    })
}).
catch((error)=>{
    console.log("db Connection failed")
})