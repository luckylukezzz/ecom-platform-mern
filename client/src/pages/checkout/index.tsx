import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-context";
import CartItem from "./cartItem";
import "./styles.css"


const CheckoutPage = () => {
    const {getCartItemCount , getTotalCartAmount} = useContext<IShopContext>(ShopContext);

    const {products} = useGetProducts();
    const total = getTotalCartAmount();
    return ( 
    <div className = "cart">
       <div>
        <h1>
            your cart items
        </h1>
       </div>

       <div className = "cart" >
        {products.map((product: IProduct)  =>{
            if (getCartItemCount(product._id) !== 0){
                return <CartItem product = {product} />;
            }
        })}
       </div>

       <div>
        <p> Subtotal: ${total}</p>
        <button className = "cart-submit-button"> Continue shopping</button>
        <button className = "cart-submit-button"> Checkout </button>

       </div>
       
    </div> );
}
 
export default CheckoutPage;