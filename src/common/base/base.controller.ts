import {
    HttpException,
    Inject,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

export class BaseController {
    logger = new Logger(this.constructor.name, { timestamp: true });
    handleError(err: any): void {
        if (err && err instanceof HttpException) {
            throw err;
        }
        throw new InternalServerErrorException(err);
    }
}
