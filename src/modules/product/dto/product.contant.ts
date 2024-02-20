import { Product } from "src/database/schemas/product.schema";

export enum ProoductOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
}

export const ProductAttributesForList: (keyof Product)[] = [
    '_id',
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'price',
    'quantity',
    'description',
    'image'
];