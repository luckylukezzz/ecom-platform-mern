import {createContext, useState} from "react";

export interface IShopContext {
    addToCart :( itemId: string) => void ;
    updateCartItemCount : (newAmount: number , itemId: string) => void ;
    removeFromCart : (itemId: string) => void ;
    getCartItemCount : (itemId: string) => number;
}


const defaultVal: IShopContext = {
    addToCart :() => null ,
    updateCartItemCount : () => null ,
    removeFromCart : () => null,
    getCartItemCount : () => 0,
}

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
    const [cartItems , setCartItems]    = useState< {string : number} | {}> ({});

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

    const contextValue: IShopContext = {
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount
    };

    //can access those funcionalities bf useContext
    return (<ShopContext.Provider value = {contextValue} >
        {props.children}
    </ShopContext.Provider>
);};