export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    ITEM_NOT_FOUND = 444,
    ITEM_ALREADY_EXIST = 445,
    ITEM_INVALID = 446,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}
export const softDeleteCondition = {
    $or: [
        {
            deletedAt: {
                $exists: true,
                $eq: null,
            },
        },
        {
            deletedAt: {
                $exists: false,
            },
        },
    ],
};

export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export const DEFAULT_PORT = 3000;
export const LANGUAGE_HEADER = 'accept-language';
export const TIMEZONE_HEADER = 'x-timezone';
export const TIMEZONE_NAME_HEADER = 'x-timezone-name';
export const TIMEZONE_DEFAULT = '+09:00';
export const TIMEZONE_NAME_DEFAULT = 'Asia/Tokyo';

export const DEFAULT_LIMIT_FOR_DROPDOWN = 1000;
export const DEFAULT_LIMIT_FOR_PAGINATION = 10;
export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_ORDER_BY = 'createdAt';
export const DEFAULT_ORDER_DIRECTION = 'desc';
export const DEFAULT_MIN_DATE = '1970-01-01 00:00:00';
export const DEFAULT_MAX_DATE = '3000-01-01 00:00:00';

export const MIN_ID = 1;
export const MIN_PAGE_LIMIT = 1; // min item per one page
export const MIN_PAGE = 1; // min page value
export const MAX_PAGE_LIMIT = 10000; // max item per one page
export const MAX_PAGE = 10000; // max page value

export const INPUT_TEXT_MAX_LENGTH = 255;
export const FIREBASE_TOKEN_MAX_LENGTH = 2000;
export const URL_MAX_LENGTH = 2048;
export const TEXTAREA_MAX_LENGTH = 2000;
export const ARRAY_MAX_LENGTH = 500;
export const INPUT_PHONE_MAX_LENGTH = 15;
export const MAX_INTEGER = 2147483647;
export const PASSWORD_MIN_LENGTH = 6;
export const MIN_PRICE = 0;
export const MAX_PRICE = Number.MAX_SAFE_INTEGER;


export enum RoleCollection {
    USERS = 'User',
    Admin='Admin'
}
export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
    expiresIn: 120,
    refresh_expiresIn: 72000,
};