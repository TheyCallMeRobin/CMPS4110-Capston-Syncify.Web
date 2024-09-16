/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /**
   * show loading status
   */
  loading?: boolean;
  /**
   * display error message
   */
  showError?: boolean;
  /**
   * data security, extended fields are encrypted using the specified algorithm
   */
  security?: Record<string, 'md5' | 'sha1' | 'aes' | 'des'>;
  /**
   * indicates whether Authorization credentials are required for the request
   * @default true
   */
  withAuthorization?: boolean;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
export interface Response<T> {
  data: T | null;
  hasErrors: boolean;
  errors: Error[];
}

export interface Error {
  propertyName: string;
  errorMessage: string;
}

export class CalendarCreateDto {
  /**  */
  'name': string;

  constructor(data: CalendarCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarGetDto {
  /**  */
  'id': number;

  /**  */
  'name': string;

  /**  */
  'createdByUserId': number;

  constructor(data: CalendarGetDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarUpdateDto {
  /**  */
  'name': string;

  constructor(data: CalendarUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class CreateUserDto {
  /**  */
  'userName': string;

  /**  */
  'password': string;

  /**  */
  'email': string;

  /**  */
  'phoneNumber': string;

  /**  */
  'firstName': string;

  /**  */
  'lastName': string;

  /**  */
  'roles': string[];

  constructor(data: CreateUserDto = {}) {
    Object.assign(this, data);
  }
}

export class EmptyResponse {
  /**  */
  'hasErrors': boolean;

  /**  */
  'errors': Error[];

  constructor(data: EmptyResponse = {}) {
    Object.assign(this, data);
  }
}

export class Error {
  /**  */
  'errorMessage': string;

  /**  */
  'propertyName'?: string;

  constructor(data: Error = {}) {
    Object.assign(this, data);
  }
}

export class LoginDto {
  /**  */
  'username': string;

  /**  */
  'password': string;

  constructor(data: LoginDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeCreateDto {
  /**  */
  'name': string;

  /**  */
  'description': string;

  /**  */
  'userId': number;

  constructor(data: RecipeCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeGetDto {
  /**  */
  'id': number;

  /**  */
  'name': string;

  /**  */
  'description': string;

  constructor(data: RecipeGetDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeIngredientCreateDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'unit': string;

  /**  */
  'recipeId': number;

  constructor(data: RecipeIngredientCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeIngredientGetDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'unit': string;

  /**  */
  'id': number;

  /**  */
  'recipeId': number;

  constructor(data: RecipeIngredientGetDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeIngredientUpdateDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'unit': string;

  constructor(data: RecipeIngredientUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class UserDto {
  /**  */
  'id': number;

  /**  */
  'userName': string;

  /**  */
  'firstName': string;

  /**  */
  'lastName': string;

  /**  */
  'email': string;

  /**  */
  'phoneNumber': string;

  /**  */
  'roles': string[];

  /**  */
  'profileColor': string;

  constructor(data: UserDto = {}) {
    Object.assign(this, data);
  }
}
