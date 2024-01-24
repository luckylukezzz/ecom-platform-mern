import {createContext, useEffect, useState} from "react";
import { IProduct } from "../models/interfaces";
import { useGetProducts } from "../hooks/useGetProducts";
import { ProductErrors } from "../models/errors";
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
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setCartItems: React.Dispatch<React.SetStateAction<{ [itemName: string]: number } | null | {}>>;
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
    setIsAuthenticated: () => null,
    setCartItems: () => null,
}

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
    const [cartItems , setCartItems]    = useState< {string : number} | {}> ({});
    const [availableMoney, setAvailableMoney] = useState<number>(0);
    const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
    const [cookies,_]= useCookies(["access_token"]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(cookies.access_token !== null);
    const [products,setProducts] = useState(null);
    // const { products } = useGetProducts();
    console.log("heres the getproducts in shopcontext",products);
    const { headers } = useGetToken();
    const navigate = useNavigate();

    //seems running everytime when using any context value
    console.log("shop context running...",cartItems,availableMoney,isAuthenticated);

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

    //need to run it once when mounted
    useEffect(()=>{
        console.log("shop context useeffect running")
        if(isAuthenticated){
            fetchAvailableMoney();
            console.log("shop context useeffect running: is Auth true");
            fetchPurchasedItems();
            
            const fetchProducts = async () => {
                try{
                    const fetchedProducts =await axios.get("http://localhost:3001/product" , {headers});
                    setProducts( fetchedProducts.data.products);
                
                }catch(err){
                    alert("something went wrong at useGetProducts ");
                }
        
            };
            const p = fetchProducts();
            setProducts(p);
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
            
            console.log(err.response);
            let errorMessage: string = "";
            switch (err.response.data.type) {
              case ProductErrors.NO_PRODUCT_FOUND:
                errorMessage = "No product found";
                break;
              case ProductErrors.NO_AVAILABLE_MONEY:
                errorMessage = "Not enough money";
                break;
              case ProductErrors.NOT_ENOUGH_STOCK:
                errorMessage = "Not enough stock";
                break;
              default:
                errorMessage = "Something went wrong";
            }
            alert("ERROR: " + errorMessage);

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
        isAuthenticated,
        setIsAuthenticated,
        setCartItems,
    };

    //can access those funcionalities bf useContext
    return (<ShopContext.Provider value = {contextValue} >
        {props.children}
    </ShopContext.Provider>
    );
};