import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import Product from "./Product";
import "./styles.css"
import { IShopContext, ShopContext } from "../../context/shop-context";
import { Navigate } from "react-router-dom";


const ShopPage = () => {
    const { isAuthenticated } = useContext<IShopContext>(ShopContext);
    const { products } = useGetProducts();
    console.log("this list from shop page (have different usegetproduct)",products);
    return (
        !isAuthenticated ? (
            <Navigate to = "./auth" />
        ):(
        <div className = "shop">
            <div className="products">
                {products.map((product) =>(<Product product={product} />))} 
            </div>
        </div>
        ) 
    );
}
 
export default ShopPage;