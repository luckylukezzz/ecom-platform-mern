import { useGetProducts } from "../../hooks/useGetProducts";
import Product from "./Product";
import "./styles.css"


const ShopPage = () => {
    const { products } = useGetProducts();
    console.log("this list from shop page (have different usegetproduct)",products);
    return (
        <div className = "shop">
            <div className="products">
                {products.map((product) =>(<Product product={product} />))} 
            </div>
        </div> );
}
 
export default ShopPage;