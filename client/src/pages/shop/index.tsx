import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import Product from "./Product";
import "./styles.css"
import { IShopContext, ShopContext } from "../../context/shop-context";
import { Navigate } from "react-router-dom";


const ShopPage = () => {
    const { isAuthenticated } = useContext<IShopContext>(ShopContext);
    const { products } = useGetProducts();
    console.log(products);
    
    if (!isAuthenticated){
        return <Navigate to = "/auth"/>
    }
   
    return (
        <div className = "shop">
            <div className="products">
                {products.map((product) =>(<Product product={product} />))} 
            </div>
        </div> );
}
 
export default ShopPage;