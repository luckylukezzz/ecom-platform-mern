import {Router, Request , Response} from "express"
import { ProductModel } from "../models/products";
import { verifyToken } from "./user";
import { UserModel } from "../models/user";
import { ProductErrors, UserErrors } from "../errors";

const router = Router();

router.get("/", verifyToken, async( _ , res: Response) => {  //not gettin req from front
    try{
        const products = await ProductModel.find({});  // retrieve everything
        res.json({products})
    } catch (err) {
        res.status(400).json({ err});
    }

});

router.post("/checkout" ,verifyToken, async( req: Request , res: Response) => {
    const { customerID, cartItems } = req.body; 
    try{
        const user = await UserModel.findById(customerID);
        const productIDs = Object.keys(cartItems);     //get the keys only list from a dictionary conataining cartItemid and quantity
        const products = await ProductModel.find({ _id: {$in: productIDs }});

        if (!user){
            res.status(400).json({type: UserErrors.NO_USER_FOUND});
        }
        if (products.length !== productIDs.length){
            res.status(400).json({type: ProductErrors.NO_PRODUCT_FOUND});
        }

        let totalPrice = 0;
        let productsToUpdate: { _id: string, quantity: number }[] = [];

        for (const item in cartItems) {
            const product = products.find((product) => String(product._id) === item);
            if (!product) {
                return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
            }
            if (product.stockQuantity < cartItems[item]){
                return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
            }
            totalPrice += product.price * cartItems[item] ;
            productsToUpdate.push({ _id: String(product._id), quantity: cartItems[item] });
        }
        if (user.availableMoney < totalPrice ){
            return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });

        }

        user.availableMoney -= totalPrice;
        user.purchasedItems.push(...productIDs);


        await user.save();
        for (const productToUpdate of productsToUpdate) {
            const product = products.find((prod) => String(prod._id) === productToUpdate._id);
            if (product) {
                product.stockQuantity -= productToUpdate.quantity;
                await ProductModel.updateOne({ _id: product._id }, { $set: { stockQuantity: product.stockQuantity } });
            }
        }

       

        res.json({ purchasedItems: user.purchasedItems });


    }catch(err){
        res.status(400).json(err);
    }
}
)

router.get("/purchased-items/:customerID" , async (req:Request, res:Response) =>{
    const { customerID } = req.params;
    // console.log(customerID);
    try{
        const user = await UserModel.findById(customerID);
        if (!user){
            res.status(400).json({type: UserErrors.NO_USER_FOUND});
        }
        //geting the product objects for the user
        const products = await ProductModel.find({_id: { $in: user.purchasedItems }});
        console.log(products);

        res.json({ purchasedItems : products  });
    }catch(err){
        res.status(500).json({ err });
    }

})



export {router as productRouter};