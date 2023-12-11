import express from "express"
import proxy from "express-http-proxy"
import logger from "morgan"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger("dev"));

app.use("/customer",proxy("http://localhost:8001"));
app.use("/product",proxy("http://localhost:8002"));
app.use("/shopping",proxy("http://localhost:8003"));

const port = 8000;
app.listen(port,()=>{
    console.log(`ApiGateway listening on ${port}...`)
})