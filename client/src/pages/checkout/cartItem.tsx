import { useContext } from "react";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { IProduct } from "../../models/interfaces";


interface Props {
    product : IProduct;
}



const CartItem = (props: Props) => {
    const {_id , imageURL , productName , price} = props.product;
    const { addToCart , removeFromCart , updateCartItemCount , getCartItemCount } = useContext<IShopContext>(ShopContext);
    return (
        <div className = "cartItem">

            <img src={imageURL}/>

            <div className = "description">
                <h3>{productName}</h3>
                <p>${price}</p>

            </div>
            <div className="countHandler">
                <button onClick={() => removeFromCart(_id)}> - </button>
                <input type = "number" value = {getCartItemCount(_id)} onChange={(e) => updateCartItemCount(Number(e.target.value) , _id)}/>
                <button onClick={() => addToCart(_id)}> + </button>
            </div>

        </div>

      );
}
 
export default CartItem;

function useContest<T>(ShopContext: any) {
    throw new Error("Function not implemented.");
}
