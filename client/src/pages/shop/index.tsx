import { useContext } from "react";
import usePagination from '../../hooks/usePagination';
import Product from "./Product";
import "./styles.css"
import { IShopContext, ShopContext } from "../../context/shop-context";
import { Navigate } from "react-router-dom";


const ShopPage = () => {
    const { isAuthenticated } = useContext<IShopContext>(ShopContext);
    const { products, currentPage, goToNextPage, goToPrevPage } = usePagination();
    console.log("this list from shop page from usePaginaion",products);
    return (
        !isAuthenticated ? (
            <Navigate to = "./auth" />
        ):(
        <div className = "shop">
            {products.length !== 0 ? (
                <div className="products">
                    {products.map((product) =>(<Product product={product} />))} 
                </div>):(<p className="no-more-items">You're all cought up</p>)
            }
    
            <div className="pagination-buttons">
                {currentPage !== 1 ? 
                (<button onClick={goToPrevPage}>Previous Page</button>):(<></>)
                }
                {products.length !== 0 ? (
                <button onClick={goToNextPage}>Next Page</button>):(<></>)}
            </div>
        </div>
        ) 
    );
}
 
export default ShopPage;