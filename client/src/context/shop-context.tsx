import {createContext, useState} from "react";
import { IProduct } from "../models/interfaces";
import { useGetProducts } from "../hooks/useGetProducts";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";

export interface IShopContext {
    addToCart :( itemId: string) => void ;
    updateCartItemCount : (newAmount: number , itemId: string) => void ;
    removeFromCart : (itemId: string) => void ;
    getCartItemCount : (itemId: string) => number;
    getTotalCartAmount : () => number;
    checkout: () => void;
}


const defaultVal: IShopContext = {
    addToCart :() => null ,
    updateCartItemCount : () => null ,
    removeFromCart : () => null,
    getCartItemCount : () => 0,
    getTotalCartAmount : () => 0,
    checkout: () => null,
}

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
    const [cartItems , setCartItems]    = useState< {string : number} | {}> ({});
    const { products} = useGetProducts();
    const { headers} = useGetToken();
    const navigate = useNavigate();
    const [availableMoney, setAvailableMoney] = useState<number>(0);

    const fetchAvailableMoney  = async () => {

    }

    const getCartItemCount = (itemId: string): number => {
        if (itemId in cartItems){
            return cartItems[itemId];
        }
        return 0;
    };

    const addToCart = ( itemId: string) => { 

        if (!cartItems[itemId]){
            setCartItems((prev)=> ({ ...prev , [itemId]: 1 }));
        } else {
            setCartItems((prev)=> ({ ...prev , [itemId]: prev[itemId] + 1 }));
        }
    };

    const removeFromCart = (itemId: string) => {
        if (!cartItems[itemId]) return;
        if (cartItems[itemId] == 0) return;
        setCartItems((prev)=> ({ ...prev , [itemId]: prev[itemId] - 1 }));
       
    };

    const updateCartItemCount = (newAmount: number , itemId: string) => {
        if (newAmount < 0 ) return;
        setCartItems((prev)=> ({ ...prev , [itemId]: newAmount }));
    };

    const getTotalCartAmount = () =>{
        let total = 0   
        for (const item in cartItems){
            if (cartItems[item] > 0 ){
                let itemInfo: IProduct = products.find((product) => product._id == item )

                total += cartItems[item] * itemInfo.price
            }
        }
        return total;
    };

    const checkout = async () => {
        const body = {customerID: localStorage.getItem("userID"), cartItems};
        try{
            await axios.post("http://localhost:3001/product/checkout", body,{headers,});
            alert("purchase success")
            navigate("/");
        }catch(err){
            console.log(err);
        }
    }

    const contextValue: IShopContext = {
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount,
        getTotalCartAmount,
        checkout
    };

    //can access those funcionalities bf useContext
    return (<ShopContext.Provider value = {contextValue} >
        {props.children}
    </ShopContext.Provider>
);};