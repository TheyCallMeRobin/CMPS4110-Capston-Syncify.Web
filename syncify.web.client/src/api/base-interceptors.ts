import { AxiosError, AxiosResponse } from 'axios';
import { LiteralKeyedObject } from '../types';

type HandledResponseCodes = '400' | '401' | '403' | '500';

type Errorhandlers = LiteralKeyedObject<
  HandledResponseCodes,
  (respose: AxiosResponse<any>) => Promise<any> | void
>;

export const defaultErrorhandlers: Errorhandlers = {
  '400': (response) => {
    console.info('Bad Request. Show Errors');
    return Promise.resolve(response);
  },
  '401': (response) => {
    return Promise.resolve({
      data: null,
      hasErrors: true,
      errors: [
        {
          propertyName: 'Authentication',
          errorMessage: 'Your session has expied. Please log in again',
        },
      ],
    });
  },
  '403': (response) => {
    console.error('You are not authorized to perform this action');
  },
  '500': (response) => {
    console.error(response.data.errors.map((x) => x.errorMessage).join(' '));
    return Promise.resolve(response);
  },
};

let errorHandlers = {
  ...defaultErrorhandlers,
};

export async function handleResponseError(error: AxiosError) {
  if (error.response) {
    const response: AxiosResponse = error.response;
    const handler = errorHandlers[response.status];
    if (handler) {
      const result = await handler(error.response);
      if (result) {
        return result;
      }
    }
  }
  return Promise.reject(error);
}

export const responseInterceptors = (x) => x;
