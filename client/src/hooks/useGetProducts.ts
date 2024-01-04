import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import {useGetToken} from "./useGetToken";
import {IProduct} from "../models/interfaces";
import { IShopContext, ShopContext } from '../context/shop-context';

export const useGetProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const {isAuthenticated ,setIsAuthenticated} = useContext<IShopContext>(ShopContext);
       
    const { headers } = useGetToken();
    console.log("hi there");

    // useEffect(() => {
    //     const authenticated = localStorage.getItem('isAuthenticated');
    //     alert("authenticated value is"+ authenticated);
    //     if (authenticated === 'true') {
    //         setIsAuthenticated(true);
    //     }
    // });
    const fetchProducts = async () => {
        try{
            const fetchedProducts =await axios.get("http://localhost:3001/product" , {headers});
            setProducts( fetchedProducts.data.products);
        
        }catch(err){
            alert("something went wrong at useGetProducts ");
        }

    };

    useEffect(() => {
       console.log("i was in useeffect of useGetProducts ")
        if (isAuthenticated){
            fetchProducts();
        }
      
        
    }, [isAuthenticated]);  //whenever hook called and authenticated it fetches products

    return { products };
    };
