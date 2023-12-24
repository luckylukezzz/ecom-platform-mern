import { useGetProducts } from "../../hooks/useGetProducts";

const ShopPage = () => {
    const { products } = useGetProducts();
    // console.log(products);
    return (
        <div className = "shop">
            <div className="products">
                {}
            </div>
        </div> );
}
 
export default ShopPage;