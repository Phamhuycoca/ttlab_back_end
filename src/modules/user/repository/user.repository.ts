import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { BaseRepository } from "../../../common/base/base.repository";
import { User, UserDocument } from "../../../database/schemas/user.schema";
import { GetUserListQuery } from "../dto/user.interface";
import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION, DEFAULT_ORDER_BY, DEFAULT_ORDER_DIRECTION,OrderDirection,softDeleteCondition } from "../../../common/constants";
import { parseMongoProjection } from "../../../common/helper/commonFunction";
import { UserAttributesForList } from "../dto/user.constant";




@Injectable()
export class UserRepository extends BaseRepository<User>{
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: Model<UserDocument>,
    ) {
        super(UserModel);
    }


    async findAllAndCountUserByQuery(query: GetUserListQuery) {
        try {
            const {
                keyword = '',
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                // name = '',
            } = query;
            const matchQuery: FilterQuery<User> = {};
            matchQuery.$and = [
                {
                    ...softDeleteCondition,
                },
            ];

            if (keyword) {
                matchQuery.$and.push({
                    name: { $regex: `.*${keyword}.*`, $options: 'i' },
                });
            }

 

            const [result] = await this.UserModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: '$_id' },
                    },
                },
                {
                    $match: {
                        ...matchQuery,
                    },
                },
                {
                    $project: parseMongoProjection(UserAttributesForList),
                },
                {
                    $facet: {
                        count: [{ $count: 'total' }],
                        data: [
                            {
                                $sort: {
                                    [orderBy]:
                                        orderDirection === OrderDirection.ASC
                                            ? 1
                                            : -1,
                                    ['_id']:
                                        orderDirection === OrderDirection.ASC
                                            ? 1
                                            : -1,
                                },
                            },
                            {
                                $skip: (page - 1) * limit,
                            },
                            {
                                $limit: Number(limit),
                            },
                        ],
                    },
                },
            ]);
            return {
                totalItems: result?.count?.[0]?.total || 0,
                items: result?.data || [],
            };
        } catch (error) {
            this.logger.error(
                'Error in ProductRepository findAllAndCountUserByQuery: ' + error,
            );
            throw error;
        }
    }
}