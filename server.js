import express from "express"
import cors from "cors"
import dbConnection from "./config/db.js"
import 'dotenv/config'
import router from "./routers/router.js"

const app = express();
const port = process.env.PORT || 8000;
dbConnection();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use("/api/auth",router)

  app.listen(port,()=>{
        console.log(`Server is listening at port :${port}`)
  })