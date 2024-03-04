import Joi, { AnySchema, ObjectSchema } from 'joi';
import { Types } from 'mongoose';
import { MetadataKey } from '../constants';

export const parseMongoProjection = (
    attributeList: string[],
    opts?: { prefix?: string; exclude?: boolean },
): Record<string, number> => {
    const { prefix, exclude } = opts ?? {};
    let rs = {};
    attributeList.forEach((val) => {
        const path = prefix?.length ? `${prefix}.${val}` : val;
        rs = {
            ...rs,
            [path]: exclude ? 0 : 1,
        };
    });

    return rs;
};

export const toObjectId = <T extends SchemaId | SchemaId[]>(
    id: T,
): T extends SchemaId
    ? Types.ObjectId
    : T extends SchemaId[]
      ? Types.ObjectId[]
      : undefined => {
    try {
        if (!id) {
            return undefined;
        }
        if (Array.isArray(id)) {
            return id.map((item) => new Types.ObjectId(item.toString())) as any;
        }
        return new Types.ObjectId(id.toString()) as any;
    } catch (error) {
        return undefined;
    }
};

export const convertClassToJoiRawObject = <T>(classType: ClassType<T>) => {
    try {
        const constructor = classType.prototype.constructor as any;
        const parentClassName = Object.getPrototypeOf(constructor)
            ?.name as string;
        let joiObjectFromMetadata =
            Reflect.getMetadata(
                `${MetadataKey.JOI}_${constructor.name}`,
                constructor,
            ) ?? {};
        if (parentClassName?.length) {
            const parentJoiObjectFromMetadata = Reflect.getMetadata(
                `${MetadataKey.JOI}_${parentClassName}`,
                constructor,
            );
            if (parentJoiObjectFromMetadata) {
                joiObjectFromMetadata = {
                    ...parentJoiObjectFromMetadata,
                    ...joiObjectFromMetadata,
                };
            }
        }

        return joiObjectFromMetadata as Record<string, AnySchema<any>>;
    } catch (error) {
        return undefined;
    }
};
export const convertClassToJoiObjectSchema = <T>(
    classType: ClassType<T>,
): ObjectSchema<any> | undefined => {
    try {
        const joiObjectFromMetadata = convertClassToJoiRawObject(classType);
        if (joiObjectFromMetadata) {
            return Joi.object(joiObjectFromMetadata);
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};
