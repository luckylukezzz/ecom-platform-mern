import {Router,Request,Response, NextFunction} from 'express';
import {Iuser, UserModel} from "../models/user";
import { UserErrors } from '../errors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path"; 
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const accessToken =  process.env.ACCESS_TOKEN_SECRET;

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try{
        const user = await UserModel.findOne({username: username});

        if (user) {
            return res.status(400).json({type: UserErrors.USERNAME_ALREADY_EXISTS});   
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new UserModel({ username , password: hashedPassword });
        await newUser.save();
        res.json({message: "User Registered Successfully"});

        

    }catch(err){
        res.status(500).json({type: err});
    }

});

router.post('/login',async (req: Request, res: Response) => {
    const {username, password} = req.body;
    try{
        const user: Iuser =await UserModel.findOne({ username });

        if (!user){
            return res.status(400).json({type: UserErrors.NO_USER_FOUND});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(400).json({type: UserErrors.WRONG_CREDENTIALS});
        }

        const token = jwt.sign({id: user._id}, accessToken);
        res.json({token , userID: user._id});


    }catch(err){
        res.status(500).json({ type:err });
    }
});

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
        jwt.verify(authHeader, accessToken, (err) => {
            if (err) {
                console.log("why???");
                return res.status(403).send('Forbidden');
            }
            console.log("hlo im ok");
            next(); // Continue to the next middleware
        });
    } else {
        return res.status(401).send('Unauthorized');
    }
};




export {router as userRouter};