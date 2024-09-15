// import {AxiosResponse, AxiosError, AxiosRequestConfig} from 'axios';
//
// import {LiteralKeyedObject} from '../types';
// import {logger} from '../utils/logger';
// import {notifications} from '../utils/notification-service';
// import {getUser} from '../auth';
//
// type HandledResponseCodes = '400' | '401' | '403' | '500';
//
// type Errorhandlers = LiteralKeyedObject<
//   HandledResponseCodes,
//   (respose: AxiosResponse<any>) => Promise<any> | void
// >;
//
// const log = logger('axios');
//
// export const requestInterceptors = compose(
//   preventIEGetCaching,
//   applyAuthHeader
// );
//
// export const responseInterceptors = (x) => x;
//
// let requestCount = 0;
// function preventIEGetCaching(config: AxiosRequestConfig) {
//   if (/get/gi.test(config.method || '')) {
//     if (config.params) {
//       config.params['_ts'] = `${+new Date()}_${++requestCount}`;
//     } else {
//       config.params = {
//         _ts: `${+new Date()}_${++requestCount}`,
//       };
//     }
//   }
//
//   return config;
// }
//
// async function applyAuthHeader(config: AxiosRequestConfig) {
//   try {
//     const user = await getUser();
//     if (user) {
//       config.headers!['Authorization'] = `Bearer ${user.access_token}`;
//     }
//   } catch (error) {}
//   return config;
// }
//
// export const defaultErrorhandlers: Errorhandlers = {
//   '400': (response) => {
//     log.info('Bad Request. Show Errors');
//     return Promise.resolve(response);
//   },
//   '401': (response) => {
//     return Promise.resolve({
//       data: null,
//       hasErrors: true,
//       errors: [
//         {
//           propertyName: 'Authentication',
//           errorMessage: 'Your session has expied. Please log in again',
//         },
//       ],
//     });
//   },
//   '403': (response) => {
//     notifications.error('You are not authorized to perform this action');
//   },
//   '500': (response) => {
//     notifications.error(
//       response.data.errors.map((x) => x.errorMessage).join(' ')
//     );
//     return Promise.resolve(response);
//   },
// };
//
// let errorHandlers = {
//   ...defaultErrorhandlers,
// };
//
// export const setErrorHandlers = (handlers: Partial<Errorhandlers>) => {
//   Object.keys(handlers).forEach((key) => {
//     errorHandlers[key] = handlers[key];
//   });
// };
//
// export async function handleResponseError(error: AxiosError) {
//   if (error.response) {
//     const response: AxiosResponse = error.response;
//     const handler = errorHandlers[response.status];
//     if (handler) {
//       const result = await handler(error.response);
//       if (result) {
//         return result;
//       }
//     }
//   }
//   return Promise.reject(error);
// }
//
// type composeFn<T> = (x: T) => T | Promise<T>;
//
// function compose<T>(...fns: composeFn<T>[]) {
//   return async (x: T | Promise<T>): Promise<T> =>
//     fns.reduce((v, f) => (async () => f(await v))(), x);
// }
