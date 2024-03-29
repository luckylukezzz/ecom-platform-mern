import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import { IShopContext, ShopContext } from "../context/shop-context";
import { useContext } from "react";
import { useCookies } from "react-cookie";




const Navbar = () => {
    const { isAuthenticated , setIsAuthenticated ,setCartItems } = useContext<IShopContext>(ShopContext);
    const [_,setCookies] = useCookies(["access_token"]);
    

    const logout = () => {
        localStorage.clear();
        setCookies("access_token", null);
        setIsAuthenticated(false);
        setCartItems({});
    };
    
    const {availableMoney} = useContext<IShopContext>(ShopContext);
    return (
        <div className="navbar">
            <div className="navbarTitle">
                <h1>ABC store</h1>
            </div>
            <div className="navbarLinks">
                {isAuthenticated && (
                    <>
                    <Link to="/">
                    shop
                    </Link>
                    <Link to="/purchased-items">
                        Purchases
                    </Link>
                    <Link to="/checkout">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                    <Link to="/auth" onClick={logout}>
                        Logout
                    </Link>
                    
                    <span>${availableMoney.toFixed(2)}</span>
                    </>
                ) }
               

            </div>
        </div>
      );
}
 
export default Navbar;
