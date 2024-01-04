import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-context";
import CartItem from "./cartItem";
import { useNavigate } from "react-router-dom";
import "./styles.css";



const CheckoutPage = () => {
    const {getCartItemCount , getTotalCartAmount , checkout} = useContext<IShopContext>(ShopContext);

    const {products} = useGetProducts();
    const total = getTotalCartAmount();
    console.log("total is ", total);
    const navigate = useNavigate();


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

        {total > 0 ? (
               <div className="checkout">
               <p> Subtotal: ${total.toFixed(2)}</p> 
               <button className = "cart-submit-button" onClick={() => navigate("/")}> Continue shopping</button>
               <button className = "cart-submit-button" onClick={checkout}> Checkout </button>
       
              </div>
        ) : (<h1>Shopping cart is empty</h1>)
     
        }
    </div> );
}
 
export default CheckoutPage;