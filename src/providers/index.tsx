"use client"

import { createContext, ReactNode, useState } from "react";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface OrderItemProps {
    id: string;
    amount: number;
    created: string;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        price: string;
        description: string;
        banner: string;
        category_id: string;
    };
    order: {
        id: string;
        table: number;
        name: string | null;
        draft: boolean;
        status: boolean;

    }
}

type OrderContextData = {
    isOpen: boolean;
    onRequestOpen: (order_id: string) => Promise<void>;
    onRequestClosr: () => void;
    order: OrderItemProps[];
    finishOrder: (order_id: string) => Promise<void>
}

type OrderProvaiderProps = { children: ReactNode }

export const OrderContext = createContext({} as OrderContextData);



export function OrderProvider({ children }: OrderProvaiderProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [order, setOrder] = useState<OrderItemProps[]>([]);
    const router = useRouter();

async function finishOrder(order_id: string) {
    const token = getCookieClient();

    const data = { order_id: order_id}
    

    try {
        await api.put("orders/finish", data, {
            

            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        toast.error("falha ao finalizar este pedido")
        return;
    }

    toast.success("Pedido finalizado com sucesso")
    router.refresh();
    setIsOpen(false)
}




    async function onRequestOpen(order_id: string) {

        const token = getCookieClient();
        const response = await api.get("/orders/detail", {

            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                order_id: order_id
            }
        })

        setOrder(response.data)
        setIsOpen(true)

    }


    function onRequestClosr() {
        setIsOpen(false)

    }





    return (
        <OrderContext.Provider
            value={{
                isOpen,
                onRequestOpen,
                onRequestClosr,
                finishOrder,
                order
            }}
        >

            {children}

        </OrderContext.Provider>
    )

}