import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import { IShopContext, ShopContext } from "../context/shop-context";
import { useContext } from "react";


const Navbar = () => {
    const {availableMoney} = useContext<IShopContext>(ShopContext);
    return (
        <div className="navbar">
            <div className="navbarTitle">
                <h1>ABC store</h1>
            </div>
            <div className="navbarLinks">
                <Link to="/">
                    shop
                </Link>
                <Link to="/purchased-items">
                    Purchases
                </Link>
                <Link to="/checkout">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
                
                <span>${availableMoney.toFixed(2)}</span>

            </div>
        </div>
      );
}
 
export default Navbar;
