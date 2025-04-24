import ProductType from "./ProductType";

interface OrderType{
    id: number;
    orderDateTime: Date;
    orderTotal: number;
    items: ProductType[];
}

export default OrderType;