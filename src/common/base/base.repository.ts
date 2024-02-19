import { softDeleteCondition } from '../../common/constants';
import { Inject, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, {
    FilterQuery,
    Model,
    HydratedDocument,
    CreateOptions,
    UpdateQuery,
    UpdateWithAggregationPipeline,
    Types,
} from 'mongoose';
import { parseMongoProjection } from '../helper/commonFunction';
export class BaseRepository<T extends MongoBaseSchema>{
    @InjectConnection()
    readonly connection: mongoose.Connection;
    constructor(readonly model: Model<SchemaDocument<T>>) {}
    logger = new Logger(this.constructor.name, { timestamp: true });
    async createOne(
        data: SchemaCreateDocument<T>,
        options?: CreateOptions & { aggregateErrors?: true },
    ): Promise<HydratedDocument<SchemaDocument<T>>> {
        try {
            //console.log(data)
            if (options) {
                return (await this.model.create([data], options))?.[0];
            } else {
                return this.model.create(data);
            }
        } catch (error) {
            this.logger.error(`Error in BaseRepository createOne: ${error}`);
            throw error;
        }
    }
    async softDeleteOne(filter: FilterQuery<SchemaDocument<T>>) {
        try {
            return this.model.updateOne(filter, {
                deletedAt: new Date(),
            });
        } catch (error) {
            this.logger.error(`Error in BaseRepository softDelete: ${error}`);
            throw error;
        }
    }
    async getOneById(id: SchemaId, attributes: SchemaAttribute<T>[]) {
        try {
            return this.model.findOne(
                { _id: new Types.ObjectId(id), ...softDeleteCondition },
                parseMongoProjection(attributes as string[]),
            );
        } catch (error) {
            this.logger.error(`Error in BaseRepository getOneById: ${error}`);
            throw error;
        }
    }
    async updateOneById(
        id: SchemaId,
        update: UpdateQuery<SchemaDocument<T>> | UpdateWithAggregationPipeline,
    ) {
        try {
            return this.model.updateOne(
                { _id: new Types.ObjectId(id) },
                update,
            );
        } catch (error) {
            this.logger.error(
                `Error in BaseRepository updateOneById: ${error}`,
            );
            throw error;
        }
    }

    async findOne(filter: FilterQuery<SchemaDocument<T>>) {
        try {
            return this.model.findOne({
                ...filter,
                ...softDeleteCondition,
            });
        } catch (error) {
            this.logger.error(`Error in BaseRepository findOne: ${error}`);
            throw error;
        }
    }
}
