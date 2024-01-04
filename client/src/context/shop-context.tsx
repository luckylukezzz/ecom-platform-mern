import {createContext, useEffect, useState} from "react";
import { IProduct } from "../models/interfaces";
import { useGetProducts } from "../hooks/useGetProducts";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export interface IShopContext {
    addToCart :( itemId: string) => void ;
    updateCartItemCount : (newAmount: number , itemId: string) => void ;
    removeFromCart : (itemId: string) => void ;
    getCartItemCount : (itemId: string) => number;
    getTotalCartAmount : () => number;
    checkout: () => void;
    availableMoney: number; 
    purchasedItems: IProduct[];
    isAuthenticated : boolean;
    setIsAuthenticated : (isAuthenticated: boolean) => void;
}


const defaultVal: IShopContext = {
    addToCart :() => null ,
    updateCartItemCount : () => null ,
    removeFromCart : () => null,
    getCartItemCount : () => 0,
    getTotalCartAmount : () => 0,
    checkout: () => null,
    availableMoney: 0,
    purchasedItems: [],
    isAuthenticated: false,
    setIsAuthenticated: () => null ,
}

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
    const [cartItems , setCartItems]    = useState< {string : number} | {}> ({});
    const [availableMoney, setAvailableMoney] = useState<number>(0);
    const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
    const [cookie,setCookie] =useCookies(["access_token"])
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(cookie.access_token !== null);

    const { products } = useGetProducts();
    const { headers } = useGetToken();
    const navigate = useNavigate();
    
    // useEffect(() => {
    //     const authenticated = localStorage.getItem('isAuthenticated');
    //     alert("authenticated value is"+ authenticated);
    //     if (authenticated === 'true') {
    //         setIsAuthenticated(true);
    //     }
    // });

    const fetchAvailableMoney  = async () => {
        try{ 
            const res = await axios.get(`http://localhost:3001/user/available-money/${localStorage.getItem('userID')}`, {headers});
            setAvailableMoney(res.data.availableMoney);
        }catch(err){
            alert("error: couldnt fetch the avail money");
        }
    }

    const fetchPurchasedItems = async () => {
        try{ 
            const res = await axios.get(`http://localhost:3001/product/purchased-items/${localStorage.getItem('userID')}`, {headers});
            setPurchasedItems(res.data.purchasedItems);
        }catch(err){
            alert("error: couldnt fetch the items");
        }
    }

    //need to run it once
    useEffect(()=>{
        console.log("i was in he useEffect of shopcontext");
        if (isAuthenticated) {
            fetchAvailableMoney();
            fetchPurchasedItems(); 
        }
    },[isAuthenticated]);

    useEffect(()=>{
        if(!isAuthenticated){
            localStorage.clear();
            setCookie("access_token",null);
        }
    },[isAuthenticated]);
    

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
        if (cartItems[itemId] === 0) return;
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
                let itemInfo: IProduct = products.find((product) => product._id === item )

                total += cartItems[item] * itemInfo.price
            }
        }
        return total;
    };

    const checkout = async () => {
        const body = {customerID: localStorage.getItem("userID"), cartItems};
        try{
            await axios.post("http://localhost:3001/product/checkout", body,{headers,});

            setCartItems({});  //clear the cart 
            fetchAvailableMoney(); //update the navbar
            fetchPurchasedItems(); //update the purchased item list
            alert("purchase success");
            navigate("/");
        }catch(err){
            alert("products not available/not enough money");
            console.log(err);
        }
    }

    
    const contextValue: IShopContext = {
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount,
        getTotalCartAmount,
        checkout,
        availableMoney,
        purchasedItems,
        setIsAuthenticated,
        isAuthenticated, 
    };

    //can access those funcionalities bf useContext
    return (<ShopContext.Provider value = {contextValue} >
        {props.children}
    </ShopContext.Provider>
);};