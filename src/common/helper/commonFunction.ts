import { Types } from 'mongoose';

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
