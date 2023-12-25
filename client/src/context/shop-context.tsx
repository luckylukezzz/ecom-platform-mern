import {createContext, useState} from "react";

export interface IShopContext {
    addToCart :( itemId: string) => void ;
    updateCartAmounCount : (newAmount: number , itemId: string) => void ;
    removeFromCart : (itemId: string) => void ;
}


const defaultVal: IShopContext = {
    addToCart :() => null ,
    updateCartAmounCount : () => null ,
    removeFromCart : () => null,
}

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
    const [cartItems , setCartItems]    = useState< {string : number} | {}> ({});

    const addToCart = ( itemId: string) => { alert(" im in the cart")};
    const removeFromCart = (itemId: string) => {};
    const updateCartAmounCount = (newAmount: number , itemId: string) => {};

    const contextValue: IShopContext = {
        addToCart,
        removeFromCart,
        updateCartAmounCount
    };

    //can access those funcionalities by useContext
    return (<ShopContext.Provider value = {contextValue} >
        {props.children}
    </ShopContext.Provider>
);};