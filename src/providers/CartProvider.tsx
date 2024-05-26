import {createContext, PropsWithChildren, useContext, useState} from "react";
import {CartItem, Product} from "@/src/types";
import {randomUUID} from "expo-crypto";

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void,
    updateQuantity: (itemId: string, amount: -1 | 1 ) => void,
    total:number
}

const CartContext = createContext<CartType>({
    items:[],
    addItem: () => {},
    updateQuantity: () => {},
    total:0
})

const CartProvider = ({children}: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([])
    //if already in cart, increment quantity


    const addItem = (product: Product, size: CartItem['size']) => {
        const existingItem = items.find(
            (item) => item.product === product && item.size === size
        )

        if (existingItem){
            updateQuantity(existingItem.id, 1)
            return
        }
        const newCartItem: CartItem = {
            id: randomUUID(), //generate
            product_id:product.id,
            product,
            size,
            quantity:1,
        }
        setItems([newCartItem, ...items])
        console.log(product);
    }

    const updateQuantity = (itemId: string, amount: -1 | 1 ) => {
        const updateItems = items.map(item =>
            item.id !== itemId
                ? item
                : {...item, quantity: item.quantity + amount}
        ).filter((item)=> item.quantity > 0)
        setItems(updateItems)
    }

    console.log(items);
    //updateQuantity
    const total = items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0)

    return (
        <CartContext.Provider
            value={{items, addItem, updateQuantity, total }}
        >
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider

export const useCart = () => useContext(CartContext)
