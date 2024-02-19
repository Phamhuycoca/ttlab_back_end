import { Inject, Logger } from '@nestjs/common';
import { toObjectId } from '../helper/commonFunction';
import { BaseRepository } from './base.repository';

export class BaseService<
    T extends MongoBaseSchema = any,
    R extends BaseRepository<T> = undefined,
> {
    constructor(repo?: R) {
        this.repository = repo;
    }
    repository: R;
    logger = new Logger(this.constructor.name, { timestamp: true });
    async softDeleteById(id: SchemaId) {
        try {
            return this.repository.softDeleteOne({ _id: toObjectId(id) });
        } catch (error) {
            this.logger.error(`Error in BaseService softDeleteById: ${error}`);
            throw error;
        }
    }
}


