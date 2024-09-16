import axios from 'axios';
import qs from 'qs';
import {serviceOptions} from './index.defs';

import { Env } from '../../config/environment-vars.ts';

console.log(Env.apiBaseUrl)
export const instance = axios.create({
  baseURL: Env.apiBaseUrl,
  paramsSerializer: (params) => qs.stringify(params, {allowDots: true}),
});

serviceOptions.axios = instance;
