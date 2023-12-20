import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {userRouter} from "./routes/user";
import {productRouter} from "./routes/product";
import path from "path"; 

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const dbPassword =  process.env.DB_PASSWORD;
const dbUsername =  process.env.DB_USERNAME;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@ecommerce.5de8pgx.mongodb.net/`);

app.listen(3001 , () => {console.log("listening on http://localhost:3001")})
