import { useContext } from "react";
import {IProduct} from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-context";

interface Props {
    product: IProduct;
}


const  Product= ( props: Props) => {
    const {
        _id,
        productName,
        price,
        description,
        imageURL,
        stockQuantity} = props.product;

    const { addToCart } = useContext<IShopContext>(ShopContext);

    return ( 
    <div className = "product">
        <img src={imageURL}/>
        <div className = "description">
            <h3>{productName}</h3>
            <p>{description}</p>
            <p>${price}</p>

        </div>
        <button className = "addToCartBttn" onClick={()=> addToCart(_id)} >Add to Cart</button>
        <div className="stock-quantity">
            {stockQuantity === 0 && <h1> OUT OF STOCK</h1> }

        </div>
    </div>
     );
}
 
export default Product;