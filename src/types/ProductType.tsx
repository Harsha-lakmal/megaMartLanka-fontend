import CategoryType from "./CategoryType";

interface ProductType{
    id: number;
    name: string;
    description: string;
    price: number;
    category: CategoryType
}

export default ProductType;

