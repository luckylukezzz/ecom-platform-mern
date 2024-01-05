import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {userRouter} from "./routes/user";
import {productRouter} from "./routes/product";
import path from "path"; 

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const dbLink =  process.env.DB_LINK;


const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose.connect(`${dbLink}`);

app.listen(3001 , () => {console.log("listening on http://localhost:3001")})
