import axios from 'axios';
import qs from 'qs';
import { serviceOptions } from './index.defs';

import { Env } from '../../config/environment-vars.ts';
import {
  handleResponseError,
  responseInterceptors,
} from '../base-interceptors.ts';

console.log(Env.apiBaseUrl);
export const instance = axios.create({
  baseURL: Env.apiBaseUrl,
  paramsSerializer: (params) => qs.stringify(params, { allowDots: true }),
});

instance.interceptors.response.use(responseInterceptors, handleResponseError);

serviceOptions.axios = instance;
