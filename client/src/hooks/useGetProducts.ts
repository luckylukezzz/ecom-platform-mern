import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import {useGetToken} from "./useGetToken";
import {IProduct} from "../models/interfaces";
import { IShopContext, ShopContext } from '../context/shop-context';

//this runs everytime when getUseProducts called except useeffect in it
export const useGetProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const {isAuthenticated} = useContext<IShopContext>(ShopContext);
    const { headers } = useGetToken();

    const fetchProducts = async () => {
        try{
            const fetchedProducts =await axios.get("http://localhost:3001/product" , {headers});
            setProducts( fetchedProducts.data.products);
        
        }catch(err){
            alert("something went wrong at useGetProducts ");
        }

    };
    console.log("useGetProducts working");
    useEffect(() => {
        if(isAuthenticated){
            console.log("use effect in  useGetProducts working");
            fetchProducts();
        }
       
    }, [isAuthenticated]);

    return { products };
    };
