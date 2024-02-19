import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';
export type ProductDocument = SchemaDocument<Product>;
@Schema({
    timestamps: true,
    collection: MongoCollection.PRODUCT,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Product extends MongoBaseSchema {
    @Prop({ required: true, type: String })
    name?: string;

    @Prop({ required: true, type: Number })
    price?: number;

    @Prop({ required: true, type: Number })
    quantity?: number;
    
    @Prop({ required: true, type: String })
    description?: string;
    
    @Prop({ required: false, type: String })
    image?: string;
}
const ProductSchema = createSchemaForClass(Product);

export { ProductSchema };
