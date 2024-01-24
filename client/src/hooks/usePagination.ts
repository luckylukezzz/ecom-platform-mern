import { useState, useEffect,useContext } from 'react';
import axios from 'axios'; 
import {useGetToken} from "./useGetToken";
import {IProduct} from "../models/interfaces";
import { IShopContext, ShopContext } from '../context/shop-context';



const usePagination = (initialPage?: number) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(initialPage || 1);
    const {isAuthenticated} = useContext<IShopContext>(ShopContext);
    const { headers } = useGetToken();

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await axios.get<IProduct[]>(`http://localhost:3001/product/shop?page=${currentPage}`,{headers});
            setProducts(response.data);
        } catch (error) {
            alert("something went wrong at usePagination ");
        }
        };
        if(isAuthenticated){
            fetchProducts();
        }
    }, [currentPage, isAuthenticated]);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return { products, currentPage, goToNextPage, goToPrevPage };
    };

export default usePagination;
