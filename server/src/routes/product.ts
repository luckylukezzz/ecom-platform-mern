import {Router, Request , Response} from "express"
import { ProductModel } from "../models/products";

const router = Router()

router.get("/", async( _ , res: Response) => {  //not gettin req from front
    try{
        const products = await ProductModel.find({});  // retrieve everything
        res.json({products})
    } catch (err) {
        res.status(400).json({ err});
    }

});

export {router as productRouter};