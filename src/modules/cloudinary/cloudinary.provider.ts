import { v2, ConfigOptions } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'drhdgw1xx',
      api_key: '293913884755846',
      api_secret: 'mwsfqSn7nZLk5HeEDMmjV8d0GB4',
    });
  },
};
