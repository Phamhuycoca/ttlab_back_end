import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import ConfigKey from './configkey';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                console.log('Connecting to Mongoose...')
                return {
                    uri: configService.get<string>(
                        ConfigKey.MONGO_DATABASE_CONNECTION_STRING,
                    ),
                };
            },
        }),
    ],
    providers: [],
})
export class MongoModule {}
